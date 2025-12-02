package com.sistema.trashmap.api.dto

import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

data class GeopointDTO (
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude máxima é 90")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude mínima é -90")
    @NotNull(message = "Latitude não pode ser nula!")
    val latitude: Double,

    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude máxima é 180")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude mínima é -180")
    @NotNull(message = "Longitude não pode ser nula!")
    val longitude: Double
    )