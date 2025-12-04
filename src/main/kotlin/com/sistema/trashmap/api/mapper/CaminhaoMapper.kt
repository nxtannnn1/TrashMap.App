package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.response.CaminhaoDTOResponse
import com.sistema.trashmap.domain.model.Caminhao

object CaminhaoMapper {

    // Converte da Entidade (Banco) para enviar ao Frontend
    fun toDto(caminhao: Caminhao): CaminhaoDTOResponse =
        CaminhaoDTOResponse(
            id = caminhao.id,
            statusCaminhao = caminhao.statusCaminhao,
            placa = caminhao.placa,

            // --- NOVOS CAMPOS ---
            modelo = caminhao.modelo,
            capacidade = caminhao.capacidade,
            motoristaId = caminhao.motoristaId,
            // --------------------

            coordenadas = caminhao.coordenadas,
            ultimaAtualizacao = caminhao.ultimaAtualizacao
        )

    // Converte o que vem do Frontend para Salvar no Banco
    fun toEntity(caminhaoDTORequest: CaminhaoDTORequest): Caminhao =
        Caminhao(
            statusCaminhao = caminhaoDTORequest.statusCaminhao,
            placa = caminhaoDTORequest.placa,

            // --- NOVOS CAMPOS ---
            modelo = caminhaoDTORequest.modelo,
            capacidade = caminhaoDTORequest.capacidade,
            motoristaId = caminhaoDTORequest.motoristaId,
            // --------------------

            coordenadas = caminhaoDTORequest.coordenadas
        )
}