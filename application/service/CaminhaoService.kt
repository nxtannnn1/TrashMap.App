package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.response.CaminhaoDTOResponse
import com.sistema.trashmap.api.mapper.CaminhaoMapper
import com.sistema.trashmap.application.formatter.PlacaFormatter
import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Caminhao
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.exception.CaminhaoNaoEncontradoException
import com.sistema.trashmap.exception.PlacaJaExistenteException
import com.sistema.trashmap.infrastructure.repository.CaminhaoRepository
import com.sistema.trashmap.util.GeoUtils
import com.sistema.trashmap.validation.PlacaValidator
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class CaminhaoService(
    val caminhaoRepository: CaminhaoRepository
) {

    private fun validarEFormatarPlaca(placa: String, idExistente: Long? = null): String {

        val placaFormatada = PlacaFormatter.formatarPlaca(placa)
        PlacaValidator.validate(placa)

        val caminhaoExistente = caminhaoRepository.findByPlaca(placa)

        if (caminhaoExistente != null && caminhaoExistente.id != idExistente) {
            throw PlacaJaExistenteException("A placa $placa já existe no sistema! Utilize outra ou edite o caminhão existente!")
        }
        return placaFormatada
    }

    @Transactional
    fun cadastrarCaminhao(caminhaoDTORequest: CaminhaoDTORequest): CaminhaoDTOResponse {

        val placaFormatada = validarEFormatarPlaca(caminhaoDTORequest.placa)

        val caminhao = caminhaoRepository.save(
            Caminhao(
                id = null,
                placa = placaFormatada,
                statusCaminhao = caminhaoDTORequest.statusCaminhao,
                coordenadas = caminhaoDTORequest.coordenadas
            )
        )

        return CaminhaoMapper.toDto(caminhao)

    }

    @Transactional
    fun cadastrarVariosCaminhoes(caminhoesDTO: List<CaminhaoDTORequest>): List<CaminhaoDTOResponse> {

        val caminhoes = caminhoesDTO.map { dto ->
            val placaFormatada = validarEFormatarPlaca(dto.placa)

            Caminhao(
                id = null,
                placa = placaFormatada,
                statusCaminhao = dto.statusCaminhao,
                coordenadas = dto.coordenadas
            )
        }

        return caminhaoRepository.saveAll(caminhoes).map { CaminhaoMapper.toDto(it) }

    }

    fun buscarCaminhaoPorId(id: Long): CaminhaoDTOResponse =
        CaminhaoMapper.toDto(caminhaoRepository.findById(id).orElseThrow {
            CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
        })

    fun listarCaminhoes(
        pageable: Pageable,
        statusCaminhao: StatusCaminhao?,
        placa: String?,
        latitude: Double?,
        longitude: Double?,
        raioKm: BigDecimal?
    ): Page<CaminhaoDTOResponse> {

        val pageCaminhoes: Page<Caminhao> = when {
            placa != null -> {
                val caminhao = caminhaoRepository.findByPlaca(placa)
                if (caminhao != null) PageImpl(listOf(caminhao), pageable, 1) else PageImpl(emptyList(), pageable, 0)
            }

            statusCaminhao != null -> {
                caminhaoRepository.findAllByStatusCaminhao(statusCaminhao, pageable)
            }

            latitude != null && longitude != null && raioKm != null -> {
                val listaProximos = listarCaminhoesProximos(latitude, longitude, raioKm)
                PageImpl(listaProximos, pageable, listaProximos.size.toLong())
            }

            else -> {
                caminhaoRepository.findAll(pageable)
            }
        }

        return pageCaminhoes.map { CaminhaoMapper.toDto(it) }
    }

    @Transactional
    fun editarCaminhaoPorId(id: Long, caminhaoDTORequest: CaminhaoDTORequest): CaminhaoDTOResponse {
        val caminhao: Caminhao = caminhaoRepository.findById(id).orElseThrow {
            CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
        }

        val placaFormatada = validarEFormatarPlaca(caminhaoDTORequest.placa)

        caminhao.placa = placaFormatada
        caminhao.statusCaminhao = caminhaoDTORequest.statusCaminhao
        caminhao.coordenadas = caminhaoDTORequest.coordenadas

        caminhaoRepository.save(caminhao)

        return CaminhaoMapper.toDto(caminhao)

    }

    @Transactional
    fun excluirCaminhaoPorId(id: Long) = caminhaoRepository.delete(caminhaoRepository.findById(id).orElseThrow {
        CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
    })


    @Transactional
    fun atualizarStatusDoCaminhao(id: Long, statusCaminhao: StatusCaminhao): CaminhaoDTOResponse {
        val caminhao: Caminhao = caminhaoRepository.findById(id).orElseThrow {
            CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
        }
        caminhao.statusCaminhao = statusCaminhao
        caminhaoRepository.save(caminhao)
        return CaminhaoMapper.toDto(caminhao)
    }

    @Transactional
    fun atualizarLocalizacao(id: Long, geopoint: Geopoint): CaminhaoDTOResponse {
        val caminhao: Caminhao = caminhaoRepository.findById(id)
            .orElseThrow { CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!") }
        caminhao.coordenadas = geopoint
        caminhaoRepository.save(caminhao)
        return CaminhaoMapper.toDto(caminhao)
    }

    fun listarCaminhoesProximos(
        latitude: Double,
        longitude: Double,
        raioKm: BigDecimal,
    ): List<Caminhao> {

        val pontoReferencia = Geopoint(latitude, longitude) //Adquire a localização do usuário

        return caminhaoRepository.findAll().filter { caminhao ->
            GeoUtils.calcularDistanciaKm(
                pontoReferencia,
                caminhao.coordenadas
            ) <= raioKm //Filtra apenas os caminhões dentro do raio
        }

    }

    fun listarPosicoesAtuais(): List<CaminhaoDTOResponse> {
        return caminhaoRepository.findAll()
            .map { CaminhaoMapper.toDto(it) }
    }


}