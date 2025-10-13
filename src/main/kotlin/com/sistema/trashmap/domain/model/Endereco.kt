package com.sistema.trashmap.domain.model

import com.sistema.trashmap.domain.enum.Estado
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

@Entity
@Table(name = "enderecos")
class Endereco(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    //Tag única, Identificador do Endereço
    // Primary Key no Banco de Dados

    @NotBlank(message = "Logradouro não pode ser vazio!")
    @Column(name = "logradouro", nullable = false)
    var logradouro: String = "",
    // Rua ou avenida do endereço
    // Obrigatório para localizar o ponto de coleta ou o caminhão, se houver vínculo

    @Column(name = "numero", nullable = true)
    var numero: String?,
    // Número do prédio ou residência

    @NotBlank(message = "CEP não pode ser vazio!")
    @Column(name = "cep", nullable = false)
    var cep: String = "",
    // Código Postal (CEP)
    // Facilita validações externas e integração com APIs de geolocalização

    @Column(name = "complemento", nullable = true)
    var complemento: String? = null,
    // Complemento do endereço (apartamento, bloco, sala, etc.)
    // Opcional, pode ser nulo

    @NotBlank(message = "Bairro não pode ser vazio!")
    @Column(name = "bairro", nullable = false)
    var bairro: String = "",
    // Bairro do endereço
    // Essencial para separar regiões e gerar estatísticas ou relatórios

    @NotNull(message = "Estado não pode ser nulo!")
    @Enumerated(EnumType.STRING)
    var estado: Estado,
    // Pode ser usada para filtros regionais ou integrações externas

    @NotBlank(message = "Cidade não pode ser vazio!")
    @Column(name = "cidade", nullable = false)
    var cidade: String = "",
    //Cidade do endereço

    @Embedded
    @NotNull(message = "Coordenadas devem ser informada")
    var coordenadas: Geopoint
    //Coordenadas geográficas do endereço
) {

    constructor(id: Long) : this(
        id,
        "",
        "",
        "",
        null,
        "",
        Estado.BA,
        "",
        Geopoint(BigDecimal("0.0"), BigDecimal("0.0"))
    )
// Construtor secundário
// Cria um endereço com valores padrão para testes ou inicializações rápidas
}