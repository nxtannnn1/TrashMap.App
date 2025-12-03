package com.sistema.trashmap.validation

import com.sistema.trashmap.exception.SenhaInvalidaException

object SenhaValidator : Validator<String> {

    override fun validate(senha: String) {

        if (senha.isBlank() && (senha.length <= 8 || senha.length > 20)) throw SenhaInvalidaException("Senha não pode ser vazia, conter menos de 8 ou superior a 20 caracteres")

    }

}