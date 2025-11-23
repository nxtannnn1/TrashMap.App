package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.request.PontoDeColetaDTORequest
import com.sistema.trashmap.api.dto.response.PontoDeColetaDTOResponse
import com.sistema.trashmap.domain.model.Endereco
import com.sistema.trashmap.domain.model.PontoDeColeta

object PontoDeColetaMapper {

    fun toDto(pontoDeColeta: PontoDeColeta): PontoDeColetaDTOResponse =
        PontoDeColetaDTOResponse(
            id = pontoDeColeta.id,
            nome = pontoDeColeta.nome,
            // Delega a conversão da entidade 'Endereco' para o 'EnderecoMapper'
            endereco = EnderecoMapper.toDto(pontoDeColeta.endereco)
        )


    // O método toEntity é diferente porque o DTO de requisição não contém a entidade Endereco,
    // apenas seu ID. A entidade 'Endereco' deve ser buscada no Service e passada aqui.
    fun toEntity(
        pontoDeColetaDTORequest: PontoDeColetaDTORequest,
        endereco: Endereco,
        idExistente: Long? = null
    ): PontoDeColeta =
        PontoDeColeta(
            id = idExistente,
            nome = pontoDeColetaDTORequest.nome,
            endereco = endereco
        )

}