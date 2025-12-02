package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Caminhao
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CaminhaoRepository : JpaRepository<Caminhao, Long> {
    fun existsByPlaca(placa: String): Boolean //Verifica se já existe um caminhão com determinada placa
    fun findByPlaca(placa: String): Caminhao? //Retorna um caminhão específico por placa
    fun findAllByStatusCaminhao(statusCaminhao: StatusCaminhao ,pageable: Pageable): Page<Caminhao> //Retorna todos os caminhões de um determinado status, com formato de paginação para evitar overload
}