package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.PontoDeColetaDTORequest
import com.sistema.trashmap.api.dto.response.PontoDeColetaDTOResponse
import com.sistema.trashmap.api.mapper.EnderecoMapper
import com.sistema.trashmap.api.mapper.PontoDeColetaMapper
import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.exception.PontoNaoEncontradoException
import com.sistema.trashmap.infrastructure.repository.EnderecoRepository
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PontoDeColetaService(
    val pontoDeColetaRepository: PontoDeColetaRepository,
    val enderecoRepository: EnderecoRepository
) {

    @Transactional
    fun cadastrarPonto(pontoDTO: PontoDeColetaDTORequest): PontoDeColetaDTOResponse {
        // Cria e salva o endereço primeiro
        val endereco = enderecoRepository.save(EnderecoMapper.toEntity(pontoDTO.endereco))

        // Cria o ponto de coleta com o endereço recém-criado
        val ponto = pontoDeColetaRepository.save(
            PontoDeColetaMapper.toEntity(pontoDTO, endereco)
        )

        return PontoDeColetaMapper.toDto(ponto)
    }

    fun cadastrarVariosPontos(pontosDTO: List<PontoDeColetaDTORequest>): List<PontoDeColetaDTOResponse> {
        val pontos = pontosDTO.map { dto ->
            val endereco = enderecoRepository.save(EnderecoMapper.toEntity(dto.endereco))
            PontoDeColetaMapper.toEntity(dto, endereco)
        }

        pontoDeColetaRepository.saveAll(pontos)
        return pontos.map { PontoDeColetaMapper.toDto(it) }
    }

    fun listarPontos(pageable: Pageable, estado: Estado?): List<PontoDeColetaDTOResponse> {

        return if (estado != null) {
            pontoDeColetaRepository.findAllByEndereco_Estado(estado, pageable).content
        } else {
            pontoDeColetaRepository.findAll(pageable).content
        }
            .map { PontoDeColetaMapper.toDto(it) }
    }

    fun listarPontoPorId(id: Long): PontoDeColetaDTOResponse =
        PontoDeColetaMapper.toDto(
            pontoDeColetaRepository.findById(id)
                .orElseThrow { PontoNaoEncontradoException("Ponto de Coleta de id $id não encontrado!") })

    @Transactional
    fun editarPontoPorId(id: Long, pontoDeColetaDTORequest: PontoDeColetaDTORequest): PontoDeColetaDTOResponse {
        val ponto = pontoDeColetaRepository.findById(id)
            .orElseThrow { PontoNaoEncontradoException("Ponto de Coleta de id $id não encontrado!") }

        ponto.nome = pontoDeColetaDTORequest.nome

        val endereco = ponto.endereco

        endereco.logradouro = pontoDeColetaDTORequest.endereco.logradouro
        endereco.numero = pontoDeColetaDTORequest.endereco.numero
        endereco.bairro = pontoDeColetaDTORequest.endereco.bairro
        endereco.cidade = pontoDeColetaDTORequest.endereco.cidade
        endereco.cep = pontoDeColetaDTORequest.endereco.cep
        endereco.estado = pontoDeColetaDTORequest.endereco.estado
        endereco.complemento = pontoDeColetaDTORequest.endereco.complemento
        endereco.coordenadas = pontoDeColetaDTORequest.endereco.coordenadas

        val enderecoSalvo = enderecoRepository.save(endereco)

        ponto.endereco = enderecoSalvo

        val pontoSalvo = pontoDeColetaRepository.save(ponto)

        return PontoDeColetaMapper.toDto(pontoSalvo)
    }

    fun excluirPontoPorId(id: Long) =
        pontoDeColetaRepository.delete(
            pontoDeColetaRepository.findById(id)
                .orElseThrow { PontoNaoEncontradoException("Ponto de Coleta de id $id não encontrado!") })


}
