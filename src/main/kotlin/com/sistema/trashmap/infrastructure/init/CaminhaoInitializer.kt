package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.application.service.CaminhaoService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class CaminhaoInitializer(val caminhaoService: CaminhaoService) : CommandLineRunner {

    override fun run(vararg args: String) {
        caminhaoService.criarCaminhoesPadrao()
    }
}