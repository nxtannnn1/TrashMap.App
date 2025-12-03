package com.sistema.trashmap.application.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.spec.SecretKeySpec
import java.util.Base64 // Importe necessário para a decodificação Base64

@Service
class JwtService(
    @Value("\${jwt.expiration}")
    private val expiration: Long,
    @Value("\${jwt.secret}")
    private val secret: String // Este valor deve ser uma String Base64 de 256 bits
) {
    // Função centralizada para decodificar e criar a chave SecretKeySpec
    private fun getKey(): SecretKeySpec {
        // Decodifica a string Base64 para os bytes binários de 256 bits
        val keyBytes = Base64.getDecoder().decode(secret)
        return SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.jcaName)
    }

    fun gerarToken(email: String): String { //Recebe o email do usuário e retorna um token Json
        val agora = Date() //Cria um objeto com a data e hora atual
        val validade = Date(agora.time + expiration) //Determina a validade para 24h

        val key = getKey() // Usa a chave decodificada e forte

        return Jwts.builder() //Processo de construção do token
            .setSubject(email) //Pertencente ao email
            .setIssuedAt(agora) //Determina que ele foi criado no momento determinado pela variável 'agora'
            .setExpiration(validade) //Determina que a validade
            .signWith(key) // Assina com a chave de 256 bits
            .compact() //Estiliza a String
    }

    fun validarToken(token: String): String {

        val key = getKey() // Usa a chave decodificada e forte

        val claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

        return claims.subject
    }

    fun extrairEmail(token: String): String {

        val key = getKey() // Usa a chave decodificada e forte

        val claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
        return claims.body.subject
    }
}