package com.sistema.trashmap.api.dto

import com.sistema.trashmap.domain.model.Geopoint
import jakarta.persistence.Embedded
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PontoDeColetaDTORequest(

    @Embedded
    @NotNull(message = "Localização deve ser informada")
    val coordenadas: Geopoint,

    @NotNull(message = "Erro")
    val endereco: EnderecoDTORequest,

    @NotBlank(message = "Nome do ponto deve ser preenchido!")
    val nome: String

)