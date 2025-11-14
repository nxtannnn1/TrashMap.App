package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.EnderecoPreset
import com.sistema.trashmap.infrastructure.repository.EnderecoRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class EnderecoInitializer(val enderecoRepository: EnderecoRepository) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (enderecoRepository.count() == 0L) {
            enderecoRepository.saveAll(
                listOf(
                    EnderecoPreset.enderecoSenai,
                    EnderecoPreset.enderecoDique
                )
            )
        } else {
            print("Pontos já inicializados")
        }
    }

}