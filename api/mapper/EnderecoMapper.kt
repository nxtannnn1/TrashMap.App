package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.request.EnderecoDTORequest
import com.sistema.trashmap.api.dto.response.EnderecoDTOResponse
import com.sistema.trashmap.domain.model.Endereco

object EnderecoMapper {

    fun toDto(endereco: Endereco): EnderecoDTOResponse =
        EnderecoDTOResponse(
            id = endereco.id,
            logradouro = endereco.logradouro,
            numero = endereco.numero,
            cep = endereco.cep,
            complemento = endereco.complemento,
            bairro = endereco.bairro,
            estado = endereco.estado,
            cidade = endereco.cidade,
            coordenadas = endereco.coordenadas
        )


    fun toEntity(enderecoDTORequest: EnderecoDTORequest): Endereco =
        Endereco(
            logradouro = enderecoDTORequest.logradouro,
            numero = enderecoDTORequest.numero,
            cep = enderecoDTORequest.cep,
            complemento = enderecoDTORequest.complemento,
            bairro = enderecoDTORequest.bairro,
            estado = enderecoDTORequest.estado,
            cidade = enderecoDTORequest.cidade,
            coordenadas = enderecoDTORequest.coordenadas
        )

}