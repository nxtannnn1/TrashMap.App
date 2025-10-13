package com.sistema.trashmap.domain.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "pontos_de_coleta")
class PontoDeColeta(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    //Tag única, Identificador do caminhão
    // Primary Key no Banco de Dados

    @ManyToOne(optional = false)
    @NotNull(message = "Endereço não pode estar vazio!")
    @JoinColumn(name = "endereco_id", nullable = false)
    var endereco: Endereco,
    // Relação com a entidade Endereco
    // Permite reutilizar o mesmo endereço em múltiplos pontos de coleta
    // Obrigatório para localizar o ponto no mapa

    @NotBlank(message = "Nome do ponto deve ser preenchido!")
    @Column(name = "nome", nullable = false)
    var nome: String,
    // Nome do ponto de coleta (ex: "Praça Central", "Mercado Municipal")
    // Importante para identificar o ponto para usuários e notificações

    @Embedded
    @NotNull(message = "Coordenadas devem ser informada")
    var coordenadas: Geopoint
    //Coordenadas geográficas
    //Utilizada para rastreamento em tempo real


    //Utilizar campo URL ou Anexo para a foto/representação do ponto de coleta
)