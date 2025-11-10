package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.application.service.UsuarioService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class UsuarioInitializer(val usuarioService: UsuarioService) : CommandLineRunner {

    override fun run(vararg args: String) {
        usuarioService.criarUsuariosPadrao()
    }
}