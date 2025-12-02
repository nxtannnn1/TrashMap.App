package com.sistema.trashmap.api.dto.request

import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Geopoint
import jakarta.persistence.Embedded
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

data class EnderecoDTORequest(

    @NotBlank(message = "Logradouro não pode ser vazio")
    var logradouro: String,

    var numero: String?,

    @NotBlank(message = "Bairro não pode ser vazio")
    var bairro: String,

    @NotBlank(message = "Cidade não pode ser vazio")
    var cidade: String,

    @NotBlank(message = "CEP não pode ser vazio")
    @Pattern(
        regexp = "\\d{8}|\\d{5}-\\d{3}",
        message = "CEP deve estar no formato 12345678 ou 12345-678"
    )
    var cep: String,

    @NotNull(message = "Estado não pode ser nulo!")
    var estado: Estado,

    var complemento: String? = null,

    @Embedded
    @NotNull(message = "Localização deve ser informada")
    @Valid
    var coordenadas: Geopoint
)