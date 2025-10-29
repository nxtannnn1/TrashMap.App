package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.model.Geopoint

data class PontoDeColetaDTOResponse(

    val id: Long?,

    val endereco: EnderecoDTOResponse,
    // Não expõe entidade JPA completa

    val nome: String,

    val coordenadas: Geopoint
)