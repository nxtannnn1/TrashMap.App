package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.EnderecoDTORequest
import com.sistema.trashmap.api.dto.response.EnderecoDTOResponse
import com.sistema.trashmap.api.mapper.EnderecoMapper
import com.sistema.trashmap.application.formatter.CepFormatter
import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Endereco
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.exception.EnderecoNaoEncontradoException
import com.sistema.trashmap.infrastructure.repository.EnderecoRepository
import com.sistema.trashmap.util.GeoUtils
import com.sistema.trashmap.validation.CepValidator
import jakarta.transaction.Transactional
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class EnderecoService(val enderecoRepository: EnderecoRepository) {

    @Transactional
    fun cadastrarEndereco(enderecoDTORequest: EnderecoDTORequest): EnderecoDTOResponse {

        CepValidator.validate(enderecoDTORequest.cep)
        val cepFormatado = CepFormatter.formatarCep(enderecoDTORequest.cep)

        val endereco = enderecoRepository.save(
            Endereco(
                id = null,
                logradouro = enderecoDTORequest.logradouro,
                numero = enderecoDTORequest.numero,
                cep = cepFormatado,
                complemento = enderecoDTORequest.complemento,
                bairro = enderecoDTORequest.bairro,
                estado = enderecoDTORequest.estado,
                cidade = enderecoDTORequest.cidade,
                coordenadas = enderecoDTORequest.coordenadas
            )
        )
        return EnderecoMapper.toDto(endereco)
    }

    @Transactional
    fun cadastrarVariosEnderecos(enderecosDTO: List<EnderecoDTORequest>): List<EnderecoDTOResponse> {
        val enderecos = enderecosDTO.map { dto ->
            CepValidator.validate(dto.cep)
            val cepFormatado = CepFormatter.formatarCep(dto.cep)

            Endereco(
                id = null,
                logradouro = dto.logradouro,
                numero = dto.numero,
                cep = cepFormatado,
                complemento = dto.complemento,
                bairro = dto.bairro,
                estado = dto.estado,
                cidade = dto.cidade,
                coordenadas = dto.coordenadas
            )
        }

        enderecoRepository.saveAll(enderecos)
        return enderecos.map { EnderecoMapper.toDto(it) }
    }

    fun listarEnderecoPorId(id: Long): EnderecoDTOResponse =
        EnderecoMapper.toDto(enderecoRepository.findById(id).orElseThrow {
            EnderecoNaoEncontradoException("Endereço de id $id não encontrado")
        })


    @Transactional
    fun editarEnderecoPorId(id: Long, enderecoDTORequest: EnderecoDTORequest): EnderecoDTOResponse {
        val endereco = enderecoRepository.findById(id).orElseThrow {
            EnderecoNaoEncontradoException("Endereço de id $id não encontrado")
        }

        CepValidator.validate(enderecoDTORequest.cep)
        val cepFormatado = CepFormatter.formatarCep(enderecoDTORequest.cep)

        endereco.logradouro = enderecoDTORequest.logradouro
        endereco.numero = enderecoDTORequest.numero
        endereco.bairro = enderecoDTORequest.bairro
        endereco.cidade = enderecoDTORequest.cidade
        endereco.cep = cepFormatado
        endereco.estado = enderecoDTORequest.estado
        endereco.complemento = enderecoDTORequest.complemento
        endereco.coordenadas = enderecoDTORequest.coordenadas

        return EnderecoMapper.toDto(enderecoRepository.save(endereco))
    }

    fun listarEnderecos(
        pageable: Pageable,
        latitude: BigDecimal? = null,
        longitude: BigDecimal? = null,
        raioKm: BigDecimal = BigDecimal("5.0"), // raio como BigDecimal
        cidade: String? = null,
        estado: Estado? = null
    ): List<EnderecoDTOResponse> {

        val enderecos = if (latitude != null && longitude != null) {
            listarEnderecosProximos(
                latitude,
                longitude,
                raioKm,
                cidade,
                estado
            )
        } else {
            enderecoRepository.findAll(pageable).content
        }

        return enderecos.map { EnderecoMapper.toDto(it) }
    }


    @Transactional
    fun excluirEnderecoPorId(id: Long) =
        enderecoRepository.delete(
            enderecoRepository.findById(id)
                .orElseThrow { EnderecoNaoEncontradoException("Endereço de id $id não encontrado") })

    fun listarEnderecosProximos(
        latitude: BigDecimal,
        longitude: BigDecimal,
        raioKm: BigDecimal = BigDecimal("5.0"), // raio como BigDecimal
        cidade: String? = null,
        estado: Estado? = null
    ): List<Endereco> {

        val usuarioCoordenadas = Geopoint(latitude, longitude)

        return enderecoRepository.findAll()
            .filter { endereco ->
                // Filtro por cidade e estado, se fornecidos
                val cidadeValida = cidade?.equals(endereco.cidade, ignoreCase = true) ?: true
                val estadoValido = estado?.let { it == endereco.estado } ?: true

                // Calcula distância e compara com o raio
                val distancia = GeoUtils.calcularDistanciaKm(endereco.coordenadas, usuarioCoordenadas)
                val dentroRaio = distancia.compareTo(raioKm) <= 0

                cidadeValida && estadoValido && dentroRaio
            }

    }

}






