package com.sistema.trashmap.domain.enum

import com.fasterxml.jackson.annotation.JsonValue

enum class StatusCaminhao(val descricao: String) {

    ATIVO("Ativo"),
    // Caminhão disponível e em operação
    // Pode ser exibido no mapa e receber rotas de coleta

    INATIVO("Inativo"),
    // Caminhão não está em operação
    // Não participa do rastreamento em tempo real

    EM_MANUTENCAO("Em Manutenção");
    // Caminhão em manutenção preventiva ou corretiva
    // Temporariamente indisponível para rotas de coleta


}

