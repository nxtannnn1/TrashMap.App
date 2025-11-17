package com.sistema.trashmap.infra.security

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig (
    val securityFilter: SecurityFilter
){

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() } // Desabilita proteção contra ataques CSRF (desnecessário para APIs REST)
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Define que não guardaremos estado (necessário para JWT)
            }
            .authorizeHttpRequests { authorize ->
                authorize
                    // LIBERA O CADASTRO DE USUÁRIOS (Resolvendo seu problema de acesso)
                    .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                    // LIBERA O LOGIN (Você vai precisar criar esse endpoint depois)
                    .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                    // LIBERA O SWAGGER (Opcional, se você usar para documentação)
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                    // BLOQUEIA TODO O RESTO (Exige token válido)
                    .anyRequest().authenticated()
            }
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }


}