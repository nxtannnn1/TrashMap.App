package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.GeopointDTO
import com.sistema.trashmap.api.dto.request.RotaDTORequest
import com.sistema.trashmap.api.dto.response.RotaDTOResponse
import com.sistema.trashmap.api.exceptionhandler.PontoNaoEncontrado
import com.sistema.trashmap.api.mapper.RotaMapper
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.domain.model.Rota
import com.sistema.trashmap.exception.RotaNaoEncontradaException
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import com.sistema.trashmap.infrastructure.repository.RotaRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class RotaService(
    private val rotaRepository: RotaRepository,
    private val pontoDeColetaRepository: PontoDeColetaRepository,
) {

    private fun GeopointDTO.toEntity() = Geopoint(latitude, longitude)

    @Transactional
    fun cadastrarRota(dto: RotaDTORequest): RotaDTOResponse {
        if (!pontoDeColetaRepository.existsById(dto.pontoDeColetaId)) {
            throw PontoNaoEncontrado("Ponto de coleta informado não existe.")
        }

        val rota = Rota(
            nome = dto.nome,
            pontoDeColetaId = dto.pontoDeColetaId,
            coordenadas = dto.coordenadas.map { it.toEntity() }
        )

        val rotaSalva = rotaRepository.save(rota)
        return RotaMapper.toDto(rotaSalva)
    }

    fun listarRotas(pageable: Pageable): Page<RotaDTOResponse> =
        rotaRepository.findAll(pageable).map { RotaMapper.toDto(it) }

    fun listarRotaPorId(id: Long): RotaDTOResponse {
        val rota = rotaRepository.findById(id)
            .orElseThrow { RotaNaoEncontradaException("Rota não encontrada.") }
        return RotaMapper.toDto(rota)
    }

    @Transactional
    fun excluirRotaPorId(id: Long) {
        if (!rotaRepository.existsById(id)) {
            throw IllegalArgumentException("Rota não encontrada para exclusão.")
        }
        rotaRepository.deleteById(id)
    }

    @Transactional
    fun atualizarRotaPorId(id: Long, dto: RotaDTORequest): RotaDTOResponse {
        val rota = rotaRepository.findById(id)
            .orElseThrow { RotaNaoEncontradaException("Rota não encontrada.") }

        if (!pontoDeColetaRepository.existsById(dto.pontoDeColetaId)) {
            throw IllegalArgumentException("Ponto de coleta informado não existe.")
        }

        rota.nome = dto.nome
        rota.pontoDeColetaId = dto.pontoDeColetaId
        rota.coordenadas = dto.coordenadas.map { it.toEntity() }

        val rotaAtualizada = rotaRepository.save(rota)
        return RotaMapper.toDto(rotaAtualizada)
    }
}
