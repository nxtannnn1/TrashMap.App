package com.sistema.trashmap.application.formatter

import com.sistema.trashmap.exception.CepInvalidoException

object CepFormatter { //Formatação de CEP's brasileiros

    fun formatarCep(cep: String?): String {
        if (cep.isNullOrBlank()) { //CEP não pode ser vazio
            throw CepInvalidoException("O cep não pode ser nulo ou vazio!")
        }

        val cepLimpo = cep.replace(Regex("[^0-9]"), "") //Remove os hífens, caso haja

        if (!Regex("\\d{8}").matches(cepLimpo)) { //Lança uma exceção caso os requisitos não sejam atendidos
            throw CepInvalidoException("CEP inválido! Formato aceito: 12345678 ou 12345-678")
        }

        return "${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5, 8)}" //Retorna o CEP formatado no padrão brasileiro
    }
}

