package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.model.Usuario
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

object UsuarioPreset {

    private val passwordEncoder = BCryptPasswordEncoder()

    val usuario1 = Usuario(
        email = "admin1@trashmap.com",
        senha = passwordEncoder.encode("AdmTrashMap"),
        isAdm = true,
        nome = "Adm1"
    )

    val usuario2 = Usuario(
        email = "admin2@trashmap.com",
        senha = passwordEncoder.encode("AdmTrashMap"),
        isAdm = true,
        nome = "Adm2"
    )

}


