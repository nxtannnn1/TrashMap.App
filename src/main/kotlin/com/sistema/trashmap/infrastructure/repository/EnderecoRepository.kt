package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.model.Endereco
import org.springframework.data.jpa.repository.JpaRepository
import java.math.BigDecimal

interface EnderecoRepository : JpaRepository<Endereco, Long> {
    fun findByCoordenadas_LatitudeAndCoordenadas_Longitude(latitude: BigDecimal, longitude: BigDecimal): Endereco? //Retorna um endereço segundo a latitude e longitude informadas
}