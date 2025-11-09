package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.request.UsuarioDTORequest
import com.sistema.trashmap.api.dto.response.UsuarioDTOResponse
import com.sistema.trashmap.domain.model.Usuario

object UsuarioMapper {

    fun toDto(usuario: Usuario): UsuarioDTOResponse =
        UsuarioDTOResponse(
            email = usuario.email,
            nome = usuario.nome,
            criadoEm = usuario.criadoEm
        )


    fun toEntity(usuarioDTORequest: UsuarioDTORequest): Usuario =
        Usuario(
            email = usuarioDTORequest.email,
            nome = usuarioDTORequest.nome,
            senha = usuarioDTORequest.senha,
        )

}