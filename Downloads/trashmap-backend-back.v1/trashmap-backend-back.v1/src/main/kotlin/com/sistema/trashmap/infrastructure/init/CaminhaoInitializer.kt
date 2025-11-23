package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.CaminhaoPreset
import com.sistema.trashmap.infrastructure.repository.CaminhaoRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class CaminhaoInitializer(val caminhaoRepository: CaminhaoRepository) : CommandLineRunner {

    override fun run(vararg args: String) {

        if (caminhaoRepository.count() == 0L) {
            caminhaoRepository.saveAll(
                listOf(
                    CaminhaoPreset.caminhao1,
                    CaminhaoPreset.caminhao2
                )
            )
        } else {
            print("Caminhões já inicializados")
        }
    }
}