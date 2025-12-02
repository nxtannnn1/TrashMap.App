package com.sistema.trashmap.validation

import com.sistema.trashmap.exception.CepInvalidoException

object CepValidator : Validator<String> { //Validação de CEP's brasileiros

    override fun validate(cep: String) {
        if (cep.trim().isBlank()) { //CEP não pode ser vazio
            throw CepInvalidoException("O CEP não pode ser vazio!")
        }

        val cepFormatado = cep.replace("-", "") //Remove os hífens, caso haja

        val formatoCep = Regex("\\d{8}") //Deve conter exatos 8 dígitos consecutivos

        if (!formatoCep.matches(cepFormatado)) { //Lança uma exceção caso os requisitos não sejam atendidos
            throw CepInvalidoException("CEP inválido! Formato aceito: 12345678!")
        }
    }

}