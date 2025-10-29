package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Geopoint

class EnderecoDTOResponse(
    val id: Long?,
    val logradouro: String,
    val numero: String?,
    val cep: String,
    val complemento: String?,
    val bairro: String,
    val estado: Estado,
    val cidade: String,
    val coordenadas: Geopoint
)