package com.sistema.trashmap.api.mapper

import com.sistema.trashmap.api.dto.GeopointDTO
import com.sistema.trashmap.api.dto.request.RotaDTORequest
import com.sistema.trashmap.api.dto.response.RotaDTOResponse
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.domain.model.Rota

object RotaMapper {

    fun toDto(rota: Rota): RotaDTOResponse = RotaDTOResponse(
        id = rota.id,
        pontoDeColetaId = rota.pontoDeColetaId,
        nome = rota.nome,
        coordenadas = rota.coordenadas.map { GeopointDTO(it.latitude, it.longitude) }
    )

    fun toEntity(dto: RotaDTORequest): Rota = Rota(
        pontoDeColetaId = dto.pontoDeColetaId,
        nome = dto.nome,
        coordenadas = dto.coordenadas.map { Geopoint(it.latitude, it.longitude) }
    )


}