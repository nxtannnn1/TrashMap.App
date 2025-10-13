package com.sistema.trashmap.validation

import com.sistema.trashmap.exception.PlacaInvalidaException

object PlacaValidator : Validator<String> { //Validações de placas tanto no formato antigo quanto Mercosul

    override fun validate(placa: String) {
        if (placa.isBlank()) { //Placa não pode ser vazia
            throw PlacaInvalidaException("A placa não pode ser vazia!")
        }

        val placaUpper = placa.trim().uppercase().replace("-", "") //Capitaliza a String e remove os hífens e espaços, caso haja

        val formatoAntigo = Regex("[A-Z]{3}[0-9]{4}") //ABC1234
        val formatoMercosul = Regex("[A-Z]{3}[0-9][A-Z][0-9]{2}") //ABC1D23

        if (!formatoAntigo.matches(placaUpper) && !formatoMercosul.matches(placaUpper)) { //Lança uma exceção caso os requisitos não sejam atendidos
            throw PlacaInvalidaException("Placa inválida! Formatos aceitos: ABC-1234 ou ABC1D23!")
        }
    }

}