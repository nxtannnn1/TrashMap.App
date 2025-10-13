package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.PontoDeColeta
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PontoDeColetaRepository : JpaRepository<PontoDeColeta, Long> {
    fun findByCoordenadas_LatitudeAndCoordenadas_Longitude(latitude: Double, longitude: Double): PontoDeColeta? //Retorna um ponto de coleta segundo a latitude e longitude informadas
    fun countByEndereco_Estado(estado: Estado): Int //Retorna os pontos de coleta cadastrados conforme o Estado informado
}