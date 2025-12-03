package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.api.dto.GeopointDTO

class RotaDTOResponse(
    val id: Long?,
    var pontoDeColetaId: Long,
    var nome: String,
    var coordenadas: List<GeopointDTO>
)