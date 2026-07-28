---
slug: kafka-event-driven-architecture
title: "Apache Kafka 기반 Event-Driven Architecture (EDA) 구축과 메시지 순서 보장"
authors: [brown]
tags: [Kafka, EDA, DistributedSystem, Backend]
Date: 2026-08-26 14:00
---

# Apache Kafka 기반 Event-Driven Architecture (EDA) 구축과 메시지 순서 보장

<br />

마이크로서비스 아키텍처(MSA)를 도입하면서 서비스 간 HTTP REST API 호출이 얽히고설켜 **강한 결합도(Tight Coupling)**와 장애 전파 문제가 발생했다.
이를 해소하기 위해 서비스 간 통신을 메시지 기반으로 전환하는 **이벤트 기반 아키텍처(Event-Driven Architecture)**를 Apache Kafka로 구축하고, 핵심 과제였던 **메시지 순서 보장 및 멱등성(Idempotency)**을 해결한 경험을 공유한다.

<!-- truncate -->

### 1. 왜 Kafka 기반 이벤트 기반 아키텍처인가?

REST API 직접 호출 방식은 주문 서비스가 결제, 재고, 알림 서비스의 주소를 모두 알아야 하고, 하나라도 장애가 나면 주문 자체가 실패하는 문제가 있었다.

```
[REST 방식: 강한 결합]
주문 서비스 ---> (HTTP) ---> 결제 서비스 (장애 발생 시 주문 전체 실패!)
            ---> (HTTP) ---> 재고 서비스
            ---> (HTTP) ---> 알림 서비스

[Kafka EDA 방식: 느슨한 결합]
주문 서비스 ---> [Kafka Topic: order-events] 
                       │
                       ├── (Consumer) 결제 서비스
                       ├── (Consumer) 재고 서비스
                       └── (Consumer) 알림 서비스
```

Kafka를 매개체로 사용하면 이벤트 생산자(Producer)는 이벤트를 발행하기만 하고, 소비자(Consumer)들은 자신의 속도에 맞춰 메시지를 소비(Pull)하므로 비동기식 느슨한 결합이 완성된다!

---

### 2. 메시지 순서 보장(Ordering Guarantee) 전략

주문 처리 과정에서 `[주문 생성] -> [결제 완료] -> [배송 시작]` 순서로 이벤트가 발행되는데, 네트워크 재시도로 인해 메시지 순서가 뒤바뀌어 소비되면 재앙이 일어난다.

#### Kafka에서 순서를 보장하는 원리

1. **Partition Key 지정**: 동일한 주문 ID(`orderId`)를 파티션 키로 지정하여 메시지를 전송한다.
   - Kafka는 동일한 파티션 키를 가진 메시지를 **동일한 파티션(Partition)**에만 배치한다.
   - 하나의 파티션 내부에서는 메시지의 FIFO 순서가 완벽히 보장된다!

```java
// Producer 코드 예시
@Service
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendOrderEvent(String orderId, OrderEvent event) {
        String payload = JsonUtils.toJson(event);
        
        // Key에 orderId를 지정하여 동일 파티션으로 전송!
        kafkaTemplate.send("order-events", orderId, payload);
    }
}
```

2. **Producer 설정 튜닝**:
   - `enable.idempotence = true` (중복 전송 방지 및 멱등성 보장)
   - `max.in.flight.requests.per.connection = 5` (멱등성 프로듀서가 활성화되면 순서 재배치 문제 해결됨)

---

### 3. Consumer 멱등성(Idempotency) 및 DB 중복 처리 방지

네트워크 일시 장애로 인해 Producer가 메시지를 재전송하거나 Consumer가 오프셋 커밋 전에 재시작되면 **동일한 이벤트가 2번 이상 수신**될 수 있다.

이를 대비하여 Consumer 서비스는 반드시 **멱등성(Idempotency) 패턴**을 적용해야 한다.

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final ProcessedEventRepository processedEventRepository;
    private final PaymentService paymentService;

    @KafkaListener(topics = "order-events", groupId = "payment-group")
    @Transactional
    public void consume(ConsumerRecord<String, String> record) {
        String eventId = record.key() + ":" + record.offset();

        // 1. 이미 처리된 이벤트인지 DB 확인 (Unique Key)
        if (processedEventRepository.existsById(eventId)) {
            log.warn("이미 처리된 중복 이벤트 생략: {}", eventId);
            return;
        }

        OrderEvent event = JsonUtils.fromJson(record.value(), OrderEvent.class);

        // 2. 비즈니스 로직 실행
        paymentService.process(event);

        // 3. 처리된 이벤트 ID 저장
        processedEventRepository.save(new ProcessedEvent(eventId));
    }
}
```

---

### 마무리 / Outro

Kafka 기반 이벤트 기반 아키텍처를 적용하면서 서비스 간 결합도가 획기적으로 낮아졌고, 시스템 일부에 장애가 발생해도 이벤트가 Kafka에 안전하게 쌓여 있다가 복구 후 정상 처리되는 놀라운 탄력성(Resilience)을 체감했다.

대규모 분산 시스템 설계의 핵심 기술인 Kafka 정복 성공! 한잔해🥂!
