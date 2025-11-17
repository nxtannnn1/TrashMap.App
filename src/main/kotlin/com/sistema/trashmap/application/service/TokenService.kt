package com.sistema.trashmap.application.service

import com.sistema.trashmap.domain.model.Usuario
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import java.security.Key

@Service
class TokenService {

    // Pega o valor do application.properties
    @Value("\${api.security.token.secret}")
    private lateinit var secret: String

    @Value("\${api.security.token.expiration}")
    private var expiration: Long = 0

    // Transforma a String do segredo em uma Chave Criptográfica
    private fun getKey(): Key {
        return Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun gerarToken(usuario: Usuario): String {
        val agora = Date()
        val dataExpiracao = Date(agora.time + expiration)

        return Jwts.builder()
            .setIssuer("TrashMap API") // Quem emitiu
            .setSubject(usuario.email) // O "Dono" do token (identificador único)
            .setIssuedAt(agora)        // Quando foi criado
            .setExpiration(dataExpiracao) // Quando vence
            .signWith(getKey(), SignatureAlgorithm.HS256) // Assina com nosso segredo
            .compact()
    }

    fun getSubject(tokenJWT: String): String {
        try {
            // Tenta ler o token usando a chave secreta
            val claims: Claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(tokenJWT)
                .body

            return claims.subject // Retorna o e-mail que estava guardado no token
        } catch (exception: Exception) {
            throw RuntimeException("Token JWT inválido ou expirado!")
        }
    }
}