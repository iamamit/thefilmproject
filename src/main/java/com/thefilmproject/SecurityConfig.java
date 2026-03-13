package com.thefilmproject;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final org.springframework.security.oauth2.client.registration.ClientRegistrationRepository clientRegistrationRepository;

    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter,
                          OAuth2SuccessHandler oAuth2SuccessHandler,
                          org.springframework.security.oauth2.client.registration.ClientRegistrationRepository clientRegistrationRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/discover").permitAll()
                .requestMatchers("/api/users/{username}").permitAll()
                .requestMatchers("/api/skills/user/**").permitAll()
                .requestMatchers("/api/posts/feed").permitAll()
                .requestMatchers("/api/posts/user/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/*/comments").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/portfolio/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
                .failureUrl("http://localhost:3000/login?error=oauth")
                .authorizationEndpoint(auth -> auth
                    .authorizationRequestResolver(new OAuth2AuthorizationRequestResolver() {
                        final DefaultOAuth2AuthorizationRequestResolver defaultResolver =
                            new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

                        @Override
                        public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
                            OAuth2AuthorizationRequest original = defaultResolver.resolve(request);
                            String clientRegistrationId = extractRegistrationIdFromRequest(request);
                            return customize(original, clientRegistrationId);
                        }

                        @Override
                        public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
                            OAuth2AuthorizationRequest original = defaultResolver.resolve(request, clientRegistrationId);
                            return customize(original, clientRegistrationId);
                        }

                        private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest original, String clientRegistrationId) {
                            if (original == null) return null;
                            if (clientRegistrationId == null) return original;
                            if ("google".equals(clientRegistrationId)) {
                                Map<String, Object> extras = new HashMap<>(original.getAdditionalParameters());
                                extras.put("prompt", "select_account");
                                return OAuth2AuthorizationRequest.from(original).additionalParameters(extras).build();
                            }
                            return original;
                        }

                        private String extractRegistrationIdFromRequest(HttpServletRequest request) {
                            String uri = request.getRequestURI();
                            if (uri == null) return null;
                            String prefix = "/oauth2/authorization/";
                            int idx = uri.indexOf(prefix);
                            if (idx < 0) return null;
                            return uri.substring(idx + prefix.length());
                        }
                    })
                    .baseUri("/oauth2/authorization"))
                .redirectionEndpoint(redirect -> redirect.baseUri("/login/oauth2/code/*"))
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
