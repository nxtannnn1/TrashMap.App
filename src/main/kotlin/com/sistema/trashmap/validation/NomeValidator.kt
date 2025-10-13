package com.sistema.trashmap.validation

import com.sistema.trashmap.exception.NomeInvalidoException

object NomeValidator : Validator<String> {

    override fun validate(nome: String) {

        when {
            nome.trim()
                .isBlank() -> throw NomeInvalidoException("O nome não pode ser vazio ou conter mais de 20 caracteres!")

            nome.trim().length > 20 -> throw NomeInvalidoException("O nome não pode ser vazio ou conter mais de 20 caracteres!")
        }

    }
}