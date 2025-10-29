package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.response.CaminhaoDTOResponse
import com.sistema.trashmap.domain.model.Caminhao

object CaminhaoMapper {

    fun toDto(caminhao: Caminhao): CaminhaoDTOResponse =
        CaminhaoDTOResponse(
            id = caminhao.id,
            statusCaminhao = caminhao.statusCaminhao,
            placa = caminhao.placa,
            coordenadas = caminhao.coordenadas,
            capacidadeKg = caminhao.capacidadeKg,
            ultimaAtualizacao = caminhao.ultimaAtualizacao
        )


    fun toEntity(caminhaoDTORequest: CaminhaoDTORequest): Caminhao =
        Caminhao(
            statusCaminhao = caminhaoDTORequest.statusCaminhao,
            placa = caminhaoDTORequest.placa,
            coordenadas = caminhaoDTORequest.coordenadas,
            capacidadeKg = caminhaoDTORequest.capacidadeKg
        )

}