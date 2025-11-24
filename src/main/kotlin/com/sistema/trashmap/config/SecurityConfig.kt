package com.sistema.trashmap.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() } // 1. Desabilita o CSRF
            .headers { headers ->
                headers.frameOptions { frameOptions ->
                    frameOptions.sameOrigin() // 2. Permite o iFrame do H2
                }
            }
            .authorizeHttpRequests { authorize ->
                // 3. Libera TUDO para o ambiente de desenvolvimento (Postman)
                authorize.requestMatchers("/**").permitAll()
            }

        return http.build()
    }
}