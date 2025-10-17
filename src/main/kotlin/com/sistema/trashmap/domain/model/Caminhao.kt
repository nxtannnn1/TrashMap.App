package com.sistema.trashmap.domain.model

import com.sistema.trashmap.domain.enum.StatusCaminhao
import jakarta.persistence.*
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "caminhoes")
class Caminhao(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    //Tag única, Identificador do caminhão
    // Primary Key no Banco de Dados

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status deve ser preenchido!")
    @Column(name = "status_caminhao", nullable = false)
    var statusCaminhao: StatusCaminhao,
    //Indica o estado do caminhão desejado
    // Teremos: Ativo, Inativo e Em Manutenção

    @NotBlank(message = "Placa não pode ser vazia!")
    @Column(name = "placa", nullable = false, unique = true)
    @Pattern(
        regexp = "([A-Z]{3}-\\d{4})|([A-Z]{3}\\d[A-Z]\\d{2})",
        message = "Placa inválida. Formatos aceitos: ABC-1234 ou ABC1D23"
    )
    var placa: String,
    //Placa do caminhão coletor
    //Modelo Placa: "AAA-0123"
    //Única para evitar duplicidade

    @Embedded
    @NotNull(message = "Coordenadas devem ser informada")
    var coordenadas: Geopoint,
    //Coordenadas geográficas
    //Utilizada para rastreamento em tempo real

    @NotNull(message = "Favor inserir um valor válido")
    @DecimalMin(value = "1", message = "Pesagem mínima = 1Kg")
    @DecimalMax(value = "10000", message = "Pesagem máxima = 10.000kg")
    @Column(name = "capacidade_em_kg", nullable = false, precision = 10, scale = 2)
    var capacidadeKg: BigDecimal,
    //Diz respeito à capacidade de armazenagem, em kg, do caminhão de lixo
    //Devem ser tomados certos cuidados para não ultrapassar o limite, a fim de evitar incidentes

    @UpdateTimestamp
    @Column(name = "ultima_atualizacao", nullable = false)
    var ultimaAtualizacao: LocalDateTime = LocalDateTime.now()
    // Armazena a data e hora da última vez que a posição do caminhão foi atualizada.
    // Atualizado automaticamente pelo Hibernate sempre que o registro for modificado.
)