package com.sistema.trashmap.util

import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal
import kotlin.math.*

object GeoUtils {// Utilitário para cálculos geográficos

    fun calcularDistanciaKm(
        p1: Geopoint,
        p2: Geopoint
    ): BigDecimal { //Calcula a distância em quilômetros entre dois pontos geográficos usando a fórmula de Haversine

        // Convertemos BigDecimal para Double para trigonometria
        val latitude1 = p1.latitude.toDouble()
        val longitude1 = p1.longitude.toDouble()
        val latitude2 = p2.latitude.toDouble()
        val longitude2 = p2.longitude.toDouble()

        val deltaLatitude = Math.toRadians(latitude2 - latitude1)
        val deltaLongitude = Math.toRadians(longitude2 - longitude1)

        val raioTerraKm = 6371.0 // Raio da Terra em km

        val haversine = sin(deltaLatitude / 2).pow(2.0) +
                cos(Math.toRadians(latitude1)) *
                cos(Math.toRadians(latitude2)) *
                sin(deltaLongitude / 2).pow(2.0)

        val anguloCentral = 2 * atan2(sqrt(haversine), sqrt(1 - haversine))

        // Retorna resultado como BigDecimal
        return BigDecimal(raioTerraKm * anguloCentral)
    }
}
