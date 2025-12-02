package com.sistema.trashmap.api.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class PontoDeColetaDTORequest(

    @NotNull(message = "Erro")
    val endereco: EnderecoDTORequest,

    @NotBlank(message = "Nome do ponto deve ser preenchido!")
    val nome: String

)