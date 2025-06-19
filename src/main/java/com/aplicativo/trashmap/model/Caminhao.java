package com.aplicativo.trashmap.model;

import com.aplicativo.trashmap.enums.STATUSCAMINHAO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Caminhao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //Tag única, Identificador do caminhão
    // Primary Key no Banco de Dados

    @NotBlank(message = "Placa não pode ser vazia!")
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "[A-Z]{3}-[0-9]{4}", message = "Placa deve estar no formato AAA-1234")
    private String placa;
    //Placa do caminhão coletor
    //Modelo Placa: "AAA-0123"
    //Única para evitar duplicidade

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status deve ser preenchido!")
    @Column(nullable = false)
    private STATUSCAMINHAO status;
    //Indica o estado do caminhão desejado
    // Teremos: Ativo, Inativo e Em Manutenção

    @NotNull(message = "Latitude deve ser preenchida")
    @Column(nullable = false)
    @Min(-90)
    @Max(90)
    private Double latitude;
    //Coordenada geográfica no Eixo Y
    //Utilizada para rastreamento em tempo real

    @NotNull(message = "Longitude deve ser preenchida")
    @Column(nullable = false)
    @Min(-180)
    @Max(180)
    private Double longitude;
    //Coordenada geográfica no Eixo X
    //Utilizada para rastreamento em tempo real

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime ultimaAtualizacao;
    // Armazena a data e hora da última vez que a posição do caminhão foi atualizada.
    // Atualizado automaticamente pelo Hibernate sempre que o registro for modificado.

    @NotNull(message = "Favor inserir um valor válido")
    @Min(value = 1, message = "Pesagem mínima = 1Kg")
    private Double capacidadeKg;

    @NotBlank(message = "Região de atuação deve ser preenchida!")
    @Column(nullable = false)
    private String regiao;
}
