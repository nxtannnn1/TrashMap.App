package com.sistema.trashmap.api.dto

import com.sistema.trashmap.domain.enum.TipoUsuario
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

class UsuarioLoginDTORequest(

    @Email
    @NotBlank(message = "E-mail não pode ser vazio")
    val email: String,

    @NotBlank(message = "Senha não pode ser vazio")
    @Size(min = 8, max = 20, message = "Senha deve possuir entre 8 e 20 caracteres")
    val senha: String,

)