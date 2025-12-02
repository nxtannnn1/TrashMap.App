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

    fun persistirDados(endereco: Endereco, enderecoDTORequest: EnderecoDTORequest){
        CepValidator.validate(enderecoDTORequest.cep)
        val cepFormatado = CepFormatter.formatarCep(enderecoDTORequest.cep)
        endereco.cep = cepFormatado
        endereco.logradouro = enderecoDTORequest.logradouro
        endereco.numero = enderecoDTORequest.numero
        endereco.bairro = enderecoDTORequest.bairro
        endereco.cidade = enderecoDTORequest.cidade
        endereco.estado = enderecoDTORequest.estado
        endereco.complemento = enderecoDTORequest.complemento
        endereco.coordenadas = enderecoDTORequest.coordenadas
    }


    @Transactional
    fun editarEnderecoPorId(id: Long, enderecoDTORequest: EnderecoDTORequest): EnderecoDTOResponse {
        val endereco = enderecoRepository.findById(id).orElseThrow {
            EnderecoNaoEncontradoException("Endereço de id $id não encontrado")
        }

        persistirDados(endereco,enderecoDTORequest)

        return EnderecoMapper.toDto(enderecoRepository.save(endereco))
    }

    fun listarEnderecoPelasCoordenadas(
        latitude: Double,
        longitude: Double
    ): Endereco {
        return enderecoRepository.findByCoordenadasLatitudeAndCoordenadasLongitude(
            latitude,
            longitude
        ) ?: throw EnderecoNaoEncontradoException(
            "Nenhum endereço encontrado para as coordenadas: $latitude, $longitude"
        )

    }

    fun listarEnderecos(
        pageable: Pageable,
        latitude: Double? = null,
        longitude: Double? = null,
        raioKm: BigDecimal = BigDecimal("5.0"),
        cidade: String? = null,
        estado: Estado? = null
    ): List<EnderecoDTOResponse> {

        val enderecos = when {
            // Caso 1: coordenadas e raio zero → buscar endereço exato
            latitude != null && longitude != null && raioKm.compareTo(BigDecimal.ZERO) == 0 -> {
                val endereco = listarEnderecoPelasCoordenadas(latitude, longitude)
                listOf(endereco)
            }

            // Caso 2: coordenadas e raio informado → buscar próximos
            latitude != null && longitude != null -> {
                listarEnderecosProximos(latitude, longitude, raioKm, cidade, estado)
            }

            // Caso 3: sem coordenadas → listar tudo paginado
            else -> enderecoRepository.findAll(pageable).content
        }

        return enderecos.map { EnderecoMapper.toDto(it) }
    }

    @Transactional
    fun excluirEnderecoPorId(id: Long) =
        enderecoRepository.delete(
            enderecoRepository.findById(id)
                .orElseThrow { EnderecoNaoEncontradoException("Endereço de id $id não encontrado") })

    fun listarEnderecosProximos(
        latitude: Double,
        longitude: Double,
        raioKm: BigDecimal = BigDecimal("5.0"), // raio como BigDecimal
        cidade: String? = null,
        estado: Estado? = null
    ): List<Endereco> {

        val usuarioCoordenadas = Geopoint(latitude, longitude)

        return enderecoRepository.findAll()
            .filter { endereco ->
                // Filtro por cidade e estado, se fornecidos
                val cidadeValida = cidade == null || cidade.equals(endereco.cidade, ignoreCase = true)
                val estadoValido = estado == null || estado == endereco.estado

                // Calcula distância e compara com o raio
                val distancia = GeoUtils.calcularDistanciaKm(endereco.coordenadas, usuarioCoordenadas)
                val dentroRaio = distancia <= raioKm

                cidadeValida && estadoValido && dentroRaio
            }

    }

}






