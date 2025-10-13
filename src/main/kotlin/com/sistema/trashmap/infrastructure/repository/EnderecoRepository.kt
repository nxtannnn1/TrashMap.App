package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.model.Endereco
import org.springframework.data.jpa.repository.JpaRepository

interface EnderecoRepository : JpaRepository<Endereco, Long> {
    fun findByCoordenadas_LatitudeAndCoordenadas_Longitude(latitude: Double, longitude: Double): Endereco? //Retorna um endereço segundo a latitude e longitude informadas
}