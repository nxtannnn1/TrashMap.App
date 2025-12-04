package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.response.CaminhaoDTOResponse
import com.sistema.trashmap.api.mapper.CaminhaoMapper
import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.infrastructure.repository.CaminhaoRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Service
class CaminhaoService(
    private val repository: CaminhaoRepository
) {

    @Transactional
    fun cadastrarCaminhao(dto: CaminhaoDTORequest): CaminhaoDTOResponse {
        // O Mapper já foi corrigido no passo anterior para ler Modelo, Capacidade, etc.
        val caminhao = CaminhaoMapper.toEntity(dto)
        val salvo = repository.save(caminhao)
        return CaminhaoMapper.toDto(salvo)
    }

    @Transactional
    fun cadastrarVariosCaminhoes(dtos: List<CaminhaoDTORequest>): List<CaminhaoDTOResponse> {
        val caminhoes = dtos.map { CaminhaoMapper.toEntity(it) }
        val salvos = repository.saveAll(caminhoes)
        return salvos.map { CaminhaoMapper.toDto(it) }
    }

    fun buscarCaminhaoPorId(id: Long): CaminhaoDTOResponse {
        val caminhao = repository.findById(id)
            .orElseThrow { RuntimeException("Caminhão não encontrado com ID: $id") }
        return CaminhaoMapper.toDto(caminhao)
    }

    fun listarCaminhoes(
        pageable: Pageable,
        status: StatusCaminhao?,
        placa: String?,
        lat: Double?,
        lng: Double?,
        raio: BigDecimal?
    ): Page<CaminhaoDTOResponse> {
        // NOTA: Se você ainda não implementou o filtro complexo no Repository (Specification),
        // use apenas o findAll por enquanto para testar o cadastro.
        // return repository.findAll(pageable).map { CaminhaoMapper.toDto(it) }

        // Se já tiver query methods no repository, chame aqui.
        // Exemplo simples retornando tudo para destravar seu erro:
        return repository.findAll(pageable).map { CaminhaoMapper.toDto(it) }
    }

    @Transactional
    fun editarCaminhaoPorId(id: Long, dto: CaminhaoDTORequest): CaminhaoDTOResponse {
        val caminhao = repository.findById(id)
            .orElseThrow { RuntimeException("Caminhão não encontrado") }

        // --- ATUALIZAÇÃO DOS DADOS (Aqui estava o erro) ---
        caminhao.placa = dto.placa
        caminhao.statusCaminhao = dto.statusCaminhao
        caminhao.coordenadas = dto.coordenadas

        // Novas colunas (Resolve o problema de dados incompletos)
        caminhao.modelo = dto.modelo
        caminhao.capacidade = dto.capacidade
        caminhao.motoristaId = dto.motoristaId

        val atualizado = repository.save(caminhao)
        return CaminhaoMapper.toDto(atualizado)
    }

    @Transactional
    fun excluirCaminhaoPorId(id: Long) {
        if (!repository.existsById(id)) {
            throw RuntimeException("Caminhão não encontrado")
        }
        repository.deleteById(id)
    }

    @Transactional
    fun atualizarStatusDoCaminhao(id: Long, status: StatusCaminhao): CaminhaoDTOResponse {
        val caminhao = repository.findById(id)
            .orElseThrow { RuntimeException("Caminhão não encontrado") }

        caminhao.statusCaminhao = status
        return CaminhaoMapper.toDto(repository.save(caminhao))
    }

    @Transactional
    fun atualizarLocalizacao(id: Long, geopoint: Geopoint): CaminhaoDTOResponse {
        val caminhao = repository.findById(id)
            .orElseThrow { RuntimeException("Caminhão não encontrado") }

        caminhao.coordenadas = geopoint
        return CaminhaoMapper.toDto(repository.save(caminhao))
    }

    fun listarPosicoesAtuais(): List<CaminhaoDTOResponse> {
        return repository.findAll().map { CaminhaoMapper.toDto(it) }
    }
}