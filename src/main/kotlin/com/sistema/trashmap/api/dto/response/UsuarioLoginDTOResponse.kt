package com.sistema.trashmap.api.dto.response

class UsuarioLoginDTOResponse(

    val id: Long?,
    val nome: String,
    val email: String,
    val isAdmin: Boolean,
    val token: String,
)