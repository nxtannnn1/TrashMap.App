package com.sistema.trashmap.api.dto.request

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import jakarta.persistence.Embedded
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.validation.Valid
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import java.math.BigDecimal

data class CaminhaoDTORequest(
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status deve ser preenchido!")
    var statusCaminhao: StatusCaminhao,

    @NotBlank(message = "Placa não pode ser vazia!")
    @Pattern(
        regexp = "([A-Z]{3}-\\d{4})|([A-Z]{3}\\d[A-Z]\\d{2})",
        message = "Placa inválida. Formatos aceitos: ABC-1234 ou ABC1D23"
    )
    var placa: String,

    @Valid
    @NotNull(message = "Localização deve ser informada")
    @Embedded
    var coordenadas: Geopoint,

    @NotNull(message = "Favor inserir um valor válido")
    @DecimalMin(value = "1", message = "Pesagem mínima = 1Kg")
    var capacidadeKg: BigDecimal
    //Diz respeito à capacidade de armazenagem, em kg, do caminhão de lixo
    //Devem ser tomados certos cuidados para não ultrapassar o limite, a fim de evitar incidentes
)