package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.PontosPreset
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class PontosInitializer(val pontoDeColetaRepository: PontoDeColetaRepository) : CommandLineRunner {

    override fun run(vararg args: String) {

        if (pontoDeColetaRepository.count() == 0L) {
            pontoDeColetaRepository.saveAll(
                listOf(
                    PontosPreset.pontoSenai,
                    PontosPreset.pontoDique
                )
            )
        } else {
            print("Pontos já inicializados")
        }

    }

}