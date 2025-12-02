package com.sistema.trashmap.api.dto.request

import com.sistema.trashmap.api.dto.GeopointDTO
import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.JoinColumn
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class RotaDTORequest(

    @NotNull(message = "O ID do ponto deve ser preenchido")
    var pontoDeColetaId: Long,

    @NotBlank(message = "Nome do ponto deve ser preenchido!")
    var nome: String,

    @Valid
    @NotNull(message = "Coordenadas devem ser informadas")
    var coordenadas: List<GeopointDTO>
)
