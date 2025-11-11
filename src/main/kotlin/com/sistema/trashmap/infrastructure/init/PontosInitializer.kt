package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.application.service.PontoDeColetaService
import org.springframework.stereotype.Component
import org.springframework.boot.CommandLineRunner

@Component
class PontosInitializer (val pontoDeColetaService: PontoDeColetaService) : CommandLineRunner {

    override fun run(vararg args: String){
        pontoDeColetaService.criarPontosPadrao()
    }

}