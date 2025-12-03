package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.domain.model.Rota

object RotaPreset {

    val rotaSenai = Rota(
        id = null,
        nome = "Rota SENAI",
        pontoDeColetaId = 1L,
        coordenadas = listOf(
            Geopoint(latitude = -12.932365025683284, longitude = -38.507123296179934),
            Geopoint(latitude = -12.931778, longitude = -38.507216),
            Geopoint(latitude = (-12.931259), longitude = -38.507262),
            Geopoint(latitude = -12.928952, longitude = -38.507570),
            Geopoint(latitude = -12.927311, longitude = -38.507737)
        )
    )

    val rotaDique = Rota(
        id = null,
        nome = "Rota Dique",
        pontoDeColetaId = 2L,
        coordenadas = listOf(
            Geopoint(latitude = -12.9843333, longitude = -38.5038611),
            Geopoint(latitude = -12.9841145, longitude = -38.5038488),
            Geopoint(latitude = -12.9832393, longitude = -38.5037996),
            Geopoint(latitude = -12.9825829, longitude = -38.5037627),
            Geopoint(latitude = -12.9823889, longitude = -38.5037500)
        )
    )


}





