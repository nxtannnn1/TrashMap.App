package com.sistema.trashmap.api.dto.request

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CaminhaoDTORequest(
    @field:NotNull(message = "Status é obrigatório")
    val statusCaminhao: StatusCaminhao,

    @field:NotBlank(message = "Placa é obrigatória")
    val placa: String,

    @field:NotBlank(message = "Modelo é obrigatório")
    val modelo: String,

    val capacidade: Double?, // Pode ser nulo

    val motoristaId: Long?,  // Pode ser nulo

    @field:NotNull(message = "Coordenadas são obrigatórias")
    val coordenadas: Geopoint
)