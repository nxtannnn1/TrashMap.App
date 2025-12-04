package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Caminhao
import com.sistema.trashmap.domain.model.Geopoint

object CaminhaoPreset {

    val caminhao1 = Caminhao(
        statusCaminhao = StatusCaminhao.ATIVO,
        placa = "ABC1D23",
        // --- NOVOS CAMPOS ---
        modelo = "Volvo VM 270",
        capacidade = 14000.0, // Em kg ou toneladas, conforme sua regra
        motoristaId = 1L,     // ID fictício para teste
        // --------------------
        coordenadas = Geopoint(
            -12.932365025683284,
            -38.507123296179934
        ) // Ele está no SENAI aproximado
    )

    val caminhao2 = Caminhao(
        statusCaminhao = StatusCaminhao.ATIVO,
        placa = "ABC1D93",
        // --- NOVOS CAMPOS ---
        modelo = "Mercedes-Benz Accelo",
        capacidade = 8000.0,
        motoristaId = 2L,
        // --------------------
        coordenadas = Geopoint(
            -12.977450000000000,
            -38.508300000000000
        ) // Ele está no Habibs Dique aproximado
    )
}