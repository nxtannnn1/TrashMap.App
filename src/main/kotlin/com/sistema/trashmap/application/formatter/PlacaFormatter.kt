package com.sistema.trashmap.application.formatter

import com.sistema.trashmap.exception.PlacaInvalidaException

object PlacaFormatter { //Formatação de placas

    fun formatarPlaca(placa: String?): String {
        if (placa.isNullOrBlank()) { //CEP não pode ser vazio
            throw PlacaInvalidaException("A placa não pode ser nula ou vazia!")
        }

        val placaLimpa = placa.replace(Regex("[^a-zA-Z0-9]"), "").uppercase()

        return when {
            Regex("[A-Z]{3}[0-9]{4}").matches(placaLimpa) -> { //Retorna ABC1234
                "${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3, 7)}"
            }

            Regex("[A-Z]{3}[0-9][A-Z][0-9]{2}").matches(placaLimpa) -> placaLimpa //Retorna ABC1D23
            else -> throw PlacaInvalidaException("Placa inválida! Formatos aceitos: ABC-1234 ou ABC1D23")
        }
    }
}
