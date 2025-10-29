package com.sistema.trashmap.api.dto.response

import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal
import java.time.LocalDateTime

data class CaminhaoDTOResponse(

    val id: Long? = null,

    var statusCaminhao: StatusCaminhao,
    //Indica o estado do caminhão desejado
    // Teremos: Ativo, Inativo e Em Manutenção

    var placa: String,
    //Placa do caminhão coletor
    //Modelo Placa: "AAA-0123"
    //Única para evitar duplicidade

    var coordenadas: Geopoint,
    //Coordenadas geográficas
    //Utilizada para rastreamento em tempo real

    var capacidadeKg: BigDecimal,
    //Diz respeito à capacidade de armazenagem, em kg, do caminhão de lixo
    //Devem ser tomados certos cuidados para não ultrapassar o limite, a fim de evitar incidentes

    var ultimaAtualizacao: LocalDateTime
    // Armazena a data e hora da última vez que a posição do caminhão foi atualizada.
    // Atualizado automaticamente pelo Hibernate sempre que o registro for modificado.
)