package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import java.time.LocalDateTime

data class CaminhaoDTOResponse(
    val id: Long?,
    val statusCaminhao: StatusCaminhao,
    val placa: String,
    val modelo: String,         // Novo
    val capacidade: Double?,    // Novo
    val motoristaId: Long?,     // Novo
    val coordenadas: Geopoint,
    val ultimaAtualizacao: LocalDateTime
)