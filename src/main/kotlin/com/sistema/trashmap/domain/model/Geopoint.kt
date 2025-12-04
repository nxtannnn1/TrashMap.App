package com.sistema.trashmap.domain.model

import jakarta.persistence.Embeddable
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

@Embeddable
data class Geopoint(
    @field:Max(value = 90, message = "Latitude máxima é 90")
    @field:Min(value = -90, message = "Latitude mínima é -90")
    @field:NotNull(message = "Latitude não pode ser nula!")
    // ADICIONADO '= 0.0' PARA CRIAR O CONSTRUTOR PADRÃO DO JPA
    var latitude: Double = 0.0,

    @field:Max(value = 180, message = "Longitude máxima é 180")
    @field:Min(value = -180, message = "Longitude mínima é -180")
    @field:NotNull(message = "Longitude não pode ser nula!")
    // ADICIONADO '= 0.0' PARA CRIAR O CONSTRUTOR PADRÃO DO JPA
    var longitude: Double = 0.0
)