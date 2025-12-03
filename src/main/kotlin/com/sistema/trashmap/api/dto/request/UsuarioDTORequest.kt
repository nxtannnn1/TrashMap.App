package com.sistema.trashmap.api.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class UsuarioDTORequest(

    @Email
    @NotBlank(message = "E-mail não pode ser vazio")
    val email: String,

    @NotBlank(message = "Nome não pode ser vazio")
    val nome: String,

    @NotBlank(message = "Senha não pode ser vazio")
    @Size(min = 8, max = 20, message = "Senha deve possuir entre 8 e 20 caracteres")
    val senha: String,

)

