package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.TipoUsuario
import java.time.LocalDateTime

data class UsuarioDTOResponse(
    var email: String,
    var nome: String,
    var tipoUsuario: TipoUsuario,
    var criadoEm: LocalDateTime
)