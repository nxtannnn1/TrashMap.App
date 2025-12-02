package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.response.UsuarioLoginDTOResponse
import com.sistema.trashmap.domain.model.Usuario

object LoginMapper {

    fun toDto(usuario: Usuario, token: String): UsuarioLoginDTOResponse = UsuarioLoginDTOResponse(
        email = usuario.email,
        token = token,
        nome = usuario.nome
    )

}