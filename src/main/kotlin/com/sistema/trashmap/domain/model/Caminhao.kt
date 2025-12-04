package com.sistema.trashmap.domain.model

import com.sistema.trashmap.domain.enum.StatusCaminhao
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "caminhoes")
class Caminhao(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status deve ser preenchido!")
    @Column(name = "status_caminhao", nullable = false)
    var statusCaminhao: StatusCaminhao,

    @NotBlank(message = "Placa não pode ser vazia!")
    @Column(name = "placa", nullable = false, unique = true)
    @Pattern(
        regexp = "([A-Z]{3}-\\d{4})|([A-Z]{3}\\d[A-Z]\\d{2})",
        message = "Placa inválida. Formatos aceitos: ABC-1234 ou ABC1D23"
    )
    var placa: String,

    // --- NOVOS CAMPOS ADICIONADOS ---

    @NotBlank(message = "O modelo é obrigatório")
    @Column(name = "modelo", nullable = false)
    var modelo: String,

    @Column(name = "capacidade")
    var capacidade: Double? = 0.0,

    @Column(name = "motorista_id")
    var motoristaId: Long? = null,

    // --------------------------------

    @Embedded
    @NotNull(message = "Coordenadas devem ser informadas")
    var coordenadas: Geopoint,

    @UpdateTimestamp
    @Column(name = "ultima_atualizacao", nullable = false)
    var ultimaAtualizacao: LocalDateTime = LocalDateTime.now()
)