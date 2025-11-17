package com.sistema.trashmap.infra.security

import com.sistema.trashmap.application.service.TokenService
import com.sistema.trashmap.infrastructure.repository.UsuarioRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class SecurityFilter(
    val tokenService: TokenService,
    val usuarioRepository: UsuarioRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        // 1. Recupera o token do cabeçalho (Authorization: Bearer xyz...)
        val token = recuperarToken(request)

        if (token != null) {
            // 2. Valida o token e pega o e-mail (subject)
            val email = tokenService.getSubject(token)

            // 3. Busca o usuário no banco
            val usuario = usuarioRepository.findByEmail(email)

            if (usuario != null) {
                // 4. Cria o objeto de autenticação do Spring Security
                // OBS: Aqui assumimos que sua entidade Usuario implementa UserDetails (veja nota abaixo)
                val authentication = UsernamePasswordAuthenticationToken(
                    usuario,
                    null,
                    usuario.authorities // Se sua classe Usuario não tem isso, passe 'emptyList()' por enquanto
                )

                // 5. Salva o usuário no contexto de segurança (Logado!)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        // 6. Segue o fluxo da requisição
        filterChain.doFilter(request, response)
    }

    private fun recuperarToken(request: HttpServletRequest): String? {
        val authHeader = request.getHeader("Authorization")
        if (authHeader == null) return null
        return authHeader.replace("Bearer ", "")
    }
}