package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.CaminhaoDTOResponse
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
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class CaminhaoService(
    val caminhaoRepository: CaminhaoRepository
) {

    @Transactional
    fun cadastrarCaminhao(caminhaoDTORequest: CaminhaoDTORequest): CaminhaoDTOResponse {

        val placaFormatada = PlacaFormatter.formatarPlaca(caminhaoDTORequest.placa)
        PlacaValidator.validate(placaFormatada)

        if (caminhaoRepository.existsByPlaca(placaFormatada)) {
            throw PlacaJaExistenteException("A placa ${caminhaoDTORequest.placa} já existe no Sistema! Utilize outra ou edite o caminhão existente.!")
        }

        val caminhao = caminhaoRepository.save(
            Caminhao(
                id = null,
                placa = placaFormatada,
                statusCaminhao = caminhaoDTORequest.statusCaminhao,
                coordenadas = caminhaoDTORequest.coordenadas,
                capacidadeKg = caminhaoDTORequest.capacidadeKg
            )
        )

        return CaminhaoMapper.toDto(caminhao)

    }

    @Transactional
    fun cadastrarVariosCaminhoes(caminhoesDTO: List<CaminhaoDTORequest>): List<CaminhaoDTOResponse> {

        val caminhoes = caminhoesDTO.map { dto ->
            val placaFormatada = PlacaFormatter.formatarPlaca(dto.placa)
            PlacaValidator.validate(placaFormatada)

            if (caminhaoRepository.existsByPlaca(placaFormatada)) {
                throw PlacaJaExistenteException("A placa ${dto.placa} já existe no Sistema! Impossível cadastrar!")
            }

            Caminhao(
                id = null,
                placa = placaFormatada,
                statusCaminhao = dto.statusCaminhao,
                coordenadas = dto.coordenadas,
                capacidadeKg = dto.capacidadeKg
            )
        }

        return caminhaoRepository.saveAll(caminhoes).map { CaminhaoMapper.toDto(it) }

    }

    fun buscarCaminhaoPorId(id: Long): CaminhaoDTOResponse =
        CaminhaoMapper.toDto(caminhaoRepository.findById(id).orElseThrow {
            CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
        })


    fun listarCaminhoes(
        statusCaminhao: StatusCaminhao?,
        placa: String?,
        latitude: BigDecimal?,
        longitude: BigDecimal?,
        raioKm: BigDecimal?,
        pageable: Pageable
    ): List<CaminhaoDTOResponse> {

        val caminhoes: List<Caminhao> = when {
            placa != null -> {
                val caminhao = caminhaoRepository.findByPlaca(placa)
                if (caminhao != null) listOf(caminhao) else emptyList()
            }

            statusCaminhao != null -> {
                caminhaoRepository.findAllByStatusCaminhao(statusCaminhao, pageable).content
            }

            (latitude != null && longitude != null && raioKm != null) -> {
                listarCaminhoesProximos(latitude, longitude, raioKm)
            }

            else -> {
                caminhaoRepository.findAll(pageable).content
            }

        }
        return caminhoes.map { CaminhaoMapper.toDto(it) }
    }

    @Transactional
    fun editarCaminhaoPorId(id: Long, caminhaoDTORequest: CaminhaoDTORequest): CaminhaoDTOResponse {
        val caminhao: Caminhao = caminhaoRepository.findById(id).orElseThrow {
            CaminhaoNaoEncontradoException("Caminhão de id $id não encontrado!")
        }
        val placaFormatada = PlacaFormatter.formatarPlaca(caminhaoDTORequest.placa)
        PlacaValidator.validate(placaFormatada)

        if (caminhaoRepository.existsByPlaca(placaFormatada) && caminhao.placa != placaFormatada) {
            throw PlacaJaExistenteException("A placa ${caminhaoDTORequest.placa} já existe no Sistema! Impossível cadastrar!")
        }

        caminhao.placa = placaFormatada
        caminhao.statusCaminhao = caminhaoDTORequest.statusCaminhao
        caminhao.coordenadas = caminhaoDTORequest.coordenadas
        caminhao.capacidadeKg = caminhaoDTORequest.capacidadeKg

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
        latitude: BigDecimal,
        longitude: BigDecimal,
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

}