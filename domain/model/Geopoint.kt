package com.sistema.trashmap.domain.model

import jakarta.persistence.Embeddable
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

@Embeddable
//Embeddable significa que este campo será atrelado/vinculado como um atributo de outra classe
//Após esse vínculo, deve ser marcado como @Embedded
data class Geopoint(
    @Max(value = 90, message = "Latitude máxima é 90")
    @Min(value = -90, message = "Latitude mínima é -90")
    @NotNull(message = "Latitude não pode ser nula!")
    var latitude: Double, //BigDecimal para garantir melhor precisão

    @Max(value = 180, message = "Longitude máxima é 180")
    @Min(value = -180, message = "Longitude mínima é -180")
    @NotNull(message = "Longitude não pode ser nula!")
    var longitude: Double //BigDecimal para garantir melhor precisão
)

