package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.model.PontoDeColeta

object PontosPreset {

    val pontoDique = PontoDeColeta(
        endereco = EnderecoPreset.enderecoDique,
        nome = "Ponto Dique"
    )

    val pontoSenai = PontoDeColeta(
        endereco = EnderecoPreset.enderecoSenai,
        nome = "Ponto Dique"
    )
}