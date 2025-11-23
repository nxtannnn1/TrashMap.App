package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.PontoDeColeta
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PontoDeColetaRepository : JpaRepository<PontoDeColeta, Long> {
    fun findAllByEndereco_Estado(estado: Estado?, pageable: Pageable): Page<PontoDeColeta>

}