package com.sistema.trashmap.api.dto.response

import java.time.LocalDateTime

data class UsuarioDTOResponse(
    var email: String,
    var nome: String,
    var criadoEm: LocalDateTime
)