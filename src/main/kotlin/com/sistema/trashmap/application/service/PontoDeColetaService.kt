package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.PontoDeColetaDTORequest
import com.sistema.trashmap.api.dto.response.PontoDeColetaDTOResponse
import com.sistema.trashmap.api.mapper.EnderecoMapper
import com.sistema.trashmap.api.mapper.PontoDeColetaMapper
import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Endereco
import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.domain.model.PontoDeColeta
import com.sistema.trashmap.exception.PontoNaoEncontradoException
import com.sistema.trashmap.infrastructure.repository.EnderecoRepository
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Service
class PontoDeColetaService(
    val pontoDeColetaRepository: PontoDeColetaRepository,
    val enderecoRepository: EnderecoRepository
) {

    fun criarPontosPadrao() {
        val coordenadasSenai = Geopoint(
            latitude = BigDecimal("-12.932365025683284"),
            longitude = BigDecimal("-38.507123296179934")
        )

        val coordenadasMercadoPeixe = Geopoint(
            latitude = BigDecimal("-12.958957066017419"),
            longitude = BigDecimal("-38.502731486488415")
        )

        val coordenadasDique = Geopoint(
            latitude = BigDecimal("-12.984471184983887"),
            longitude = BigDecimal("-38.503843973429724")
        )

        val coordenadasFarolBarra = Geopoint(
            latitude = BigDecimal("-13.0092"),
            longitude = BigDecimal("-38.5320")
        )

        val coordenadasFonteNova = Geopoint(
            latitude = BigDecimal("-12.9714"),
            longitude = BigDecimal("-38.5108")
        )

        val enderecoMercadoPeixe = Endereco(
            logradouro = "Travessa Oscár Pontes",
            numero = "4",
            cep = "40460-140",
            bairro = "Comércio",
            estado = Estado.BA,
            cidade = "Salvador",
            coordenadas = coordenadasMercadoPeixe
        )

        val enderecoSenai = Endereco(
            logradouro = "Avenida Dendezeiros do Bonfim",
            numero = "99",
            cep = "40415-006",
            complemento = "Próximo ao SENAI",
            bairro = "Ribeira",
            estado = Estado.BA,
            cidade = "Salvador",
            coordenadas = coordenadasSenai
        )

        val enderecoFarolBarra = Endereco(

            logradouro = "Avenida Almirante Marques de Leão",
            cep = "40140-230",
            bairro = "Barra",
            estado = Estado.BA,
            cidade = "Salvador",
            coordenadas = coordenadasFarolBarra
        )

        val enderecoDique = Endereco(
            logradouro = "Praça Capelinha",
            cep = "40243-800",
            bairro = "Engenho Velho de Brotas",
            estado = Estado.BA,
            cidade = "Salvador",
            coordenadas = coordenadasDique
        )

        val enderecoFonteNova = Endereco(
            logradouro = "Ladeira da Fonte das Pedras",
            cep = "40050-565",
            bairro = "Nazaré",
            estado = Estado.BA,
            cidade = "Salvador",
            coordenadas = coordenadasFonteNova
        )

        enderecoRepository.saveAll(listOf(enderecoSenai, enderecoFarolBarra, enderecoFonteNova, enderecoMercadoPeixe, enderecoDique))

        val pontoSenai = PontoDeColeta(
            endereco = enderecoSenai,
            nome = "Ponto Senai"
        )

        val pontoFonteNova = PontoDeColeta(
            endereco = enderecoFonteNova,
            nome = "Ponto Fonte Nova"
        )

        val pontoBarra = PontoDeColeta(
            endereco = enderecoFarolBarra,
            nome = "Ponto Barra"
        )

        val pontoDique = PontoDeColeta(
            endereco = enderecoDique,
            nome = "Ponto Dique"
        )

        val pontoPeixe = PontoDeColeta(
            endereco = enderecoMercadoPeixe,
            nome = "Ponto Mercado do Peixe"
        )

        pontoDeColetaRepository.saveAll(listOf(pontoSenai, pontoBarra, pontoFonteNova, pontoDique, pontoPeixe))

    }

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
