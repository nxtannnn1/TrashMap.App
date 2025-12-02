package com.sistema.trashmap.api.dto.response

data class PontoDeColetaDTOResponse(

    val id: Long?,
    val endereco: EnderecoDTOResponse, // Não expõe entidade JPA completa
    val nome: String

)