package com.sistema.trashmap.api.dto.response

import java.time.LocalDateTime

data class UsuarioDTOResponse(
    val email: String,
    val nome: String,
    val isAdm: Boolean,
    val criadoEm: LocalDateTime
)