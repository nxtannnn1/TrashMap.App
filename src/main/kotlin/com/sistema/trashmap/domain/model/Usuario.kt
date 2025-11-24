package com.sistema.trashmap.domain.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "usuarios")
class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    //Tag única, Identificador do caminhão
    // Primary Key no Banco de Dados

    @Email
    @NotBlank(message = "E-mail não pode ser vazio")
    @Column(name = "email", nullable = false, unique = true)
    var email: String,
    // E-mail do usuário
    // Deve ser único e válido

    @NotBlank(message = "Nome não pode ser vazio")
    @Column(name = "nome", nullable = false)
    var nome: String,
    // Nome do usuário
    // Não deve estar em branco

    @Column(name = "is_admin", nullable = false) //Se for da Staff, isAdm é true, senão, false
    var isAdm: Boolean = false,

    @NotBlank(message = "Senha não pode ser vazio")
    @Size(min = 8, max = 20, message = "Senha deve possuir entre 8 e 20 caracteres")
    @Column(name = "senha", nullable = false)
    var senha: String,
    // Senha do usuário
    // Deve ter entre 8 e 20 caracteres

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false, nullable = false)
    val criadoEm: LocalDateTime = LocalDateTime.now()
    // Data e hora de criação do registro
    // Setado automaticamente pelo Hibernate, não pode ser alterado
)