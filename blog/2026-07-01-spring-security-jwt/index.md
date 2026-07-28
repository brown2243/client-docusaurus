---
slug: spring-security-jwt-authentication
title: "Spring Security & JWT 인증 흐름 구축기 (SecurityFilterChain & Refresh Token)"
authors: [brown]
tags: [Spring, SpringSecurity, JWT, Java, Backend]
Date: 2026-07-01 13:00
---

# Spring Security & JWT 인증 흐름 구축기 (SecurityFilterChain & Refresh Token)

<br />

프론트엔드 작업을 위주로 하다가 Spring Boot 백엔드를 다루면서 가장 큰 장벽으로 느껴졌던 것이 바로 **Spring Security**였다.
`WebSecurityConfigurerAdapter`가 deprecated되고 **`SecurityFilterChain` 빈(Bean) 등록 방식**으로 변경된 이후, JWT 인증 체계를 어떻게 깔끔하게 구축하는지 내부 아키텍처를 하나하나 짚어보았다.

<!-- truncate -->

### 1. Spring SecurityFilterChain 내부 작동 메커니즘

Spring Security는 Servlet Filter 체인 위에서 작동하는 `DelegatingFilterProxy`와 `FilterChainProxy`로 이뤄져 있다.

```
[HTTP Request] 
      |
[DelegatingFilterProxy]
      |
[FilterChainProxy] (springSecurityFilterChain)
      |
  [SecurityFilterChain]
   ├── CorsFilter / CsrfFilter
   ├── JwtAuthenticationFilter  <-- 우리가 커스텀 생성한 JWT 필터!
   ├── UsernamePasswordAuthenticationFilter
   └── ExceptionTranslationFilter
      |
[DispatcherServlet] -> Controller 진입!
```

요청이 Controller에 도달하기 전에 커스텀 JWT 필터에서 토큰 검증을 완료하고 `SecurityContextHolder`에 `Authentication` 객체를 채워 넣는 것이 핵심이다.

---

### 2. Custom JwtAuthenticationFilter 구현

`OncePerRequestFilter`를 상속받아 동일한 요청에 대해 단 한 번만 수행되는 인증 필터를 작성했다.

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            // 토큰이 유효하면 Authentication 객체 생성 후 SecurityContext에 저장!
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

### 3. SecurityFilterChain 설정 코드

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint) // 401 Unauthorized
                .accessDeniedHandler(jwtAccessDeniedHandler)           // 403 Forbidden
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            // JWT 필터를 UsernamePasswordAuthenticationFilter 이전에 배치!
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

### 4. Access Token & Refresh Token 재발급 무중단 순환 패턴

Security 체인 구축에서 가장 신경 써야 하는 부분이 **Refresh Token을 통한 Access Token 재발급(Rotation)**이다.

```
[Client] ---> API Request (Access Token) ---> [Server]
                                                 |
                                         (Token Expired 401!)
                                                 |
[Client] <--- Return 401 Unauthorized <----------+
   |
   +---> API Request (/api/auth/reissue, Refresh Token) ---> [Server]
                                                                |
                                                      (Redis 검증 및 RTR 적용)
                                                                |
[Client] <--- New Access + Refresh Token 반환 <-----------------+
```

#### RTR (Refresh Token Rotation) 방식을 적용한 Redis 검증 패턴

```java
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public TokenResponse reissue(String refreshToken) {
        // 1. Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        // 2. Redis에 저장된 Refresh Token과 일치하는지 확인
        String savedRefreshToken = redisTemplate.opsForValue().get("RT:" + authentication.getName());
        if (!refreshToken.equals(savedRefreshToken)) {
            // 탈취 가능성 감지! Redis 토큰 폐기 처리
            redisTemplate.delete("RT:" + authentication.getName());
            throw new CustomException(ErrorCode.TOKEN_MISMATCH);
        }

        // 3. 신규 Access 및 Refresh Token 재발급 (RTR 패턴)
        TokenResponse newTokens = jwtTokenProvider.generateTokenDto(authentication);
        
        // Redis 토큰 업데이트
        redisTemplate.opsForValue().set(
            "RT:" + authentication.getName(),
            newTokens.getRefreshToken(),
            jwtTokenProvider.getExpiration(newTokens.getRefreshToken()),
            TimeUnit.MILLISECONDS
        );

        return newTokens;
    }
}
```

---

### 마무리 / Outro

Spring Security의 FilterChain 흐름과 SecurityContext 생명주기를 이해하고 나니, 복잡해 보이던 JWT 인증 흐름이 눈에 확 들어왔다.

프론트엔드의 Axios Interceptor 세팅과 백엔드의 Refresh Token Rotation 패턴을 서로 연결하여 무중단 사용자 경험을 완성했을 때의 뿌듯함이란! 

다음엔 Redis 기반 세션 분산 락에 대해서도 다뤄봐야겠다. 한잔해🥂!
