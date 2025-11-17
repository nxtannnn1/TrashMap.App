package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.response.UsuarioLoginDTOResponse
import com.sistema.trashmap.domain.model.Usuario

class LoginMapper {
    companion object {
        // Agora o método aceita DOIS parâmetros: o usuario e a string do token
        fun toDto(usuario: Usuario, token: String): UsuarioLoginDTOResponse {
            return UsuarioLoginDTOResponse(
                id = usuario.id,
                nome = usuario.nome,
                email = usuario.email,
                isAdmin = usuario.isAdm,
                token = token // <--- O token entra aqui
            )
        }

        // Se você tiver um método antigo só com (usuario), pode manter ou remover,
        // mas para o login funcionar, precisamos da versão acima.
    }
}