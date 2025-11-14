package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Caminhao
import com.sistema.trashmap.domain.model.Geopoint

object CaminhaoPreset {

    val caminhao1 = Caminhao(
        statusCaminhao = StatusCaminhao.ATIVO,
        placa = "ABC1D23",
        coordenadas = Geopoint(
            -12.932365025683284,
            -38.507123296179934
        ) //Ele está no SENAI aproximado
    )

    val caminhao2 = Caminhao(
        statusCaminhao = StatusCaminhao.ATIVO,
        placa = "ABC1D93",
        coordenadas = Geopoint(
            -12.977450000000000,
            -38.508300000000000
        ) //Ele está no Habibs Dique aproximado
    )
}
