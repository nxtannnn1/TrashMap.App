package com.sistema.trashmap.domain.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "rota")
class Rota(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "ponto_de_coleta_id", nullable = false)
    var pontoDeColetaId: Long,

    @NotBlank(message = "Nome do ponto deve ser preenchido!")
    @Column(name = "nome", nullable = false)
    var nome: String,

    @ElementCollection(targetClass = Geopoint::class)
    @CollectionTable(
        name = "rota_coordenadas",
        joinColumns = [JoinColumn(name = "rota_id")]
    )
    @AttributeOverrides(
        value = [
            // AQUI ESTÁ O AJUSTE. A anotação @Column deve ser usada.
            AttributeOverride(
                name = "latitude", column = Column(name = "latitude")
            ),
            AttributeOverride(name = "longitude", column = Column(name = "longitude"))
        ]
    )
    @NotNull(message = "Coordenadas devem ser informadas")
    var coordenadas: List<Geopoint>
)