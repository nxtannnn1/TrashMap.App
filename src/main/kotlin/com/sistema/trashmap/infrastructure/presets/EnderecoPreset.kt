package com.sistema.trashmap.infrastructure.presets

import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Endereco

object EnderecoPreset {

    val enderecoSenai = Endereco(
        logradouro = "Avenida Dendezeiros do Bonfim",
        numero = "99",
        cep = "40415-006",
        complemento = "Próximo ao SENAI",
        bairro = "Ribeira",
        estado = Estado.BA,
        cidade = "Salvador",
        coordenadas = CoordenadasPreset.coordenadasSenai
    )

    val enderecoDique = Endereco(
        logradouro = "Praça Capelinha",
        cep = "40243-800",
        bairro = "Engenho Velho de Brotas",
        estado = Estado.BA,
        cidade = "Salvador",
        coordenadas = CoordenadasPreset.coordenadasDique
    )
}