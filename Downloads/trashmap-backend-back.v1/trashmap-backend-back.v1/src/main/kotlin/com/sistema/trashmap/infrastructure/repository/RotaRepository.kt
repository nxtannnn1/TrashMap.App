package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.model.Rota
import org.springframework.data.jpa.repository.JpaRepository

interface RotaRepository : JpaRepository<Rota, Long>{
}