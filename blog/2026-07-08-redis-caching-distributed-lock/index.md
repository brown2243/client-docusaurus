---
slug: redis-caching-and-redisson-distributed-lock
title: Redis 캐싱 전략과 Redisson 분산 락(Distributed Lock)으로 동시성 이슈 해결하기
authors: [brown]
tags: [Redis, Redisson, Concurrency, SpringBoot, DistributedLock]
Date: 2026-07-08 11:30
---

# Redis 캐싱 전략과 Redisson 분산 락(Distributed Lock)으로 동시성 이슈 해결하기

<br />

선착순 100명 수강신청 이벤트나 선착순 쿠폰 발급 기능을 구현할 때 가장 무서운 적은 바로 **동시성(Concurrency) 문제**다.
단순히 DB 트랜잭션의 `@Transactional`만 믿고 있다가 **Race Condition**으로 인해 재고 수량이 마이너스가 되는 대참사가 발생할 수 있다! (제발...)

Redis를 이용해 서버 읽기 성능을 극대화하는 **Cache-Aside 패턴**과, Redisson 라이브러리를 활용해 분산 락(Distributed Lock)으로 동시성을 해결한 과정을 정리해보았다.

<!-- truncate -->

### 1. Redis 캐싱 전략: Cache-Aside (Look-Aside) 패턴

조회 성능을 대폭 개선하기 위해 가장 보편적으로 사용하는 패턴이다.

```
[Client] ---> 1. Data Request ---> [Application Server]
                                          |
                                2. Cache Hit? (Redis)
                                   ├── YES -> 즉시 반환! (수 ms 이내)
                                   └── NO  -> DB 조회 후 Redis 저장 및 반환!
```

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional(readOnly = true)
    public ProductDto getProduct(Long productId) {
        String cacheKey = "product:" + productId;

        // 1. Redis 캐시 조회
        ProductDto cachedProduct = (ProductDto) redisTemplate.opsForValue().get(cacheKey);
        if (cachedProduct != null) {
            return cachedProduct; // Cache Hit!
        }

        // 2. Cache Miss -> DB 조회
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

        ProductDto dto = ProductDto.from(product);

        // 3. Redis 캐시 저장 (TTL 30분 설정하여 Cache Stampede 방지)
        redisTemplate.opsForValue().set(cacheKey, dto, 30, TimeUnit.MINUTES);

        return dto;
    }
}
```

---

### 2. 동시성 문제 발생과 Lettuce Spin Lock의 한계

수많은 트랜잭션이 동시에 재고 차감 요청(`stock = stock - 1`)을 보낼 때, DB 락(Optimistic / Pessimistic Lock)만으로는 서버 다중화(Multi-instance) 환경에서 한계가 발생한다.

Redis로 분산 락을 구현할 때 디폴트 클라이언트인 Lettuce의 `SETNX` 명령어를 사용하면 **Spin Lock(스핀 락)** 방식이 된다.

:::caution
Lettuce Spin Lock은 락을 획득할 때까지 계속해서 Redis에 `SETNX` 재시도 요청을 보내므로 Redis 서버에 엄청난 CPU 부하(Thundering Herd)를 유발한다!
:::

---

### 3. Redisson Pub/Sub 기반 분산 락 구현

Redisson은 **Pub/Sub(발행/구독)** 메커니즘을 사용하므로, 락을 해제할 때 대기 중인 다른 스레드에게 채널 메시지를 보내 알려준다. 스핀 락처럼 무의미한 폴링 재시도를 하지 않아 안전하다!

#### `@DistributedLock` 커스텀 어노테이션 및 AOP 작성

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {
    String key(); // 락 식별 키
    TimeUnit timeUnit() default TimeUnit.SECONDS;
    long waitTime() default 5L;  // 락 획득 대기 시간 (5초)
    long leaseTime() default 3L; // 락 점유 임동 시간 (3초)
}
```

```java
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class DistributedLockAop {

    private final RedissonClient redissonClient;
    private final AopForTransaction aopForTransaction;

    @Around("@annotation(distributedLock)")
    public Object lock(final ProceedingJoinPoint joinPoint, final DistributedLock distributedLock) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String key = CustomSpringELParser.getDynamicValue(signature.getParameterNames(), joinPoint.getArgs(), distributedLock.key());

        RLock rLock = redissonClient.getLock(key);

        try {
            // 락 획득 시도 (waitTime 동안 대기, leaseTime 지나면 자동 해제)
            boolean available = rLock.tryLock(distributedLock.waitTime(), distributedLock.leaseTime(), distributedLock.timeUnit());
            if (!available) {
                log.warn("Redisson Lock 획득 실패 - Key: {}", key);
                return false;
            }

            // 트랜잭션 분리를 위해 AOP 별도 실행 후 락 해제!
            return aopForTransaction.proceed(joinPoint);
        } finally {
            try {
                rLock.unlock(); // 락 해제
            } catch (IllegalMonitorStateException e) {
                log.info("Redisson Lock 이미 해제됨");
            }
        }
    }
}
```

#### 동시성 차감 메서드 적용

```java
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @DistributedLock(key = "'coupon:' + #couponId")
    public void issueCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
            .orElseThrow(() -> new IllegalArgumentException("쿠폰 없음"));
        
        coupon.decreaseQuantity(); // 락 안에서 안전하게 1씩 차감!
    }
}
```

:::tip
**주의할 점**: 락 해제(`rLock.unlock()`) 시점이 **DB 트랜잭션 `@Transactional` 커밋 시점보다 뒤에 와야 한다.**
그렇지 않으면 락이 먼저 풀린 후 DB 커밋이 완료되기 전에 다른 스레드가 침범하여 데이터 불일치가 일어날 수 있다! 위 AOP처럼 별도 트랜잭션 수명주기를 관리하는 `AopForTransaction` 처리가 필수다.
:::

---

### 마무리 / Outro

1,000명의 스레드가 동시에 coupon 차감을 요청하는 JMeter / Spring Boot 테스트에서 정합성 오류 제로(Zero Fault)를 달성했을 때의 짜릿함!

동시성을 다룰 때는 어설픈 감이 아닌 확실한 대기 메커니즘(Pub/Sub)과 트랜잭션 수명주기를 맞춰주는 것이 무엇보다 중요함을 배웠다.
