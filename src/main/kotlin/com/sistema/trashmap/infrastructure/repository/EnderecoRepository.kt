package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.model.Endereco
import org.springframework.data.jpa.repository.JpaRepository
import java.math.BigDecimal

interface EnderecoRepository : JpaRepository<Endereco, Long> {
    fun findByCoordenadasLatitudeAndCoordenadasLongitude(latitude: Double, longitude: Double): Endereco? //Retorna um endereço segundo a latitude e longitude informadas
}