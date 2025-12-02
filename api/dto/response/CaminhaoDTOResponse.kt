package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal
import java.time.LocalDateTime

data class CaminhaoDTOResponse(

    val id: Long? = null,
    var statusCaminhao: StatusCaminhao,
    var placa: String,
    var coordenadas: Geopoint,
    var ultimaAtualizacao: LocalDateTime
)