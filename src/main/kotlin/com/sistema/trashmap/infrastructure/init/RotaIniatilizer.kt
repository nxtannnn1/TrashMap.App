package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.RotaPreset
import com.sistema.trashmap.infrastructure.repository.RotaRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class RotaIniatilizer(val rotaRepository: RotaRepository) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (rotaRepository.count() == 0L) {
            rotaRepository.saveAll(
                listOf(
                    RotaPreset.rotaSenai,
                    RotaPreset.rotaDique
                )
            )
        } else {
            print("Rotas já inicializadas")
        }
    }
}