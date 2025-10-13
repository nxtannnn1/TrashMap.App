package com.sistema.trashmap.domain.model

import jakarta.persistence.Embeddable
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

@Embeddable
//Embeddable significa que este campo será atrelado/vinculado como um atributo de outra classe
//Após esse vínculo, deve ser marcado como @Embedded
class Geopoint(
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude máxima é 90")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude mínima é -90")
    @NotNull(message = "Latitude não pode ser nula!")
    var latitude: BigDecimal, //BigDecimal para garantir melhor precisão

    @DecimalMax(value = "180.0", inclusive = true, message = "Latitude máxima é 180")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Latitude mínima é -180")
    @NotNull(message = "Longitude não pode ser nula!")
    var longitude: BigDecimal //BigDecimal para garantir melhor precisão
)

//BigDecimal é tratado como String, ou seja, ao declararmos um valor, deve ser feito da forma:
//Geopoint(latitude = BigDecimal("20.00"), longitude = BigDecimal("20.00"))