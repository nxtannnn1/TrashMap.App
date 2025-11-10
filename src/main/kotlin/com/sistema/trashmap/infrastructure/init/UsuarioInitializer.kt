package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.application.service.UsuarioService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class UsuarioInitializer(val usuarioService: UsuarioService) : CommandLineRunner { // Interface Spring Boot usada para executar código após a inicialização da aplicação

    override fun run(vararg args: String) {
        usuarioService.criarUsuariosPadrao() // Evoca a função 'criar usuários padrão', garantindo a persistência dos dados
    }
}