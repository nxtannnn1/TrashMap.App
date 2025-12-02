package com.sistema.trashmap.infrastructure.repository

import com.sistema.trashmap.domain.model.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UsuarioRepository : JpaRepository<Usuario, Long> {
    fun findByEmail(email: String): Usuario? //Retorna um usuário conforme seu e-mail
}