package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.TipoUsuario

class UsuarioLoginDTOResponse(

    val nome: String,
    val email: String,
    val tipoUsuario: TipoUsuario
)