// src/main/java/com/studio/backend/config/SecurityConfig.java
package com.studio.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // APIs usually disable CSRF (esp. when called from Postman)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/customer", "/customers").permitAll()
                        .requestMatchers("/admin", "/admins").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // optional; handy for quick testing
        return http.build();
    }
}
