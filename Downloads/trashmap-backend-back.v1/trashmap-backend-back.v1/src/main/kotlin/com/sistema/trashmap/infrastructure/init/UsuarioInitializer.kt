package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.UsuarioPreset
import com.sistema.trashmap.infrastructure.repository.UsuarioRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class UsuarioInitializer(val usuarioRepository: UsuarioRepository) :
    CommandLineRunner {

    override fun run(vararg args: String) {
        if (usuarioRepository.count() == 0L) {
            usuarioRepository.saveAll(
                listOf(
                    UsuarioPreset.usuario1,
                    UsuarioPreset.usuario2
                )
            )
        } else {
            print("Usuários já inicializados")
        }
    }
}