package com.sistema.trashmap.application.service

import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.infrastructure.repository.CaminhaoRepository
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import com.sistema.trashmap.util.GeoUtils
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class CaminhaoSimuladorService(
    val caminhaoRepository: CaminhaoRepository,
    val pontoDeColetaRepository: PontoDeColetaRepository,
    val notificacaoService: NotificacaoService,
    private val messagingTemplate: SimpMessagingTemplate,
) {

    private val rotaSenai = listOf(
        Geopoint(BigDecimal("-12.932365025683284"), BigDecimal("-38.507123296179934")),
        Geopoint(BigDecimal("-12.931778"), BigDecimal("-38.507216")),
        Geopoint(BigDecimal("-12.931259"), BigDecimal("-38.507262")),
        Geopoint(BigDecimal("-12.928952"), BigDecimal("-38.507570")),
        Geopoint(BigDecimal("-12.927311"), BigDecimal("-38.507737"))
    )

    private val rotaDique = listOf(
        Geopoint(BigDecimal("-12.984463"), BigDecimal("-38.503864")),
        Geopoint(BigDecimal("-12.984307"), BigDecimal("-38.503850")),
        Geopoint(BigDecimal("-12.984241"), BigDecimal("-38.503851")),
        Geopoint(BigDecimal("-12.983932"), BigDecimal("-38.503804")),
        Geopoint(BigDecimal("-12.983190"), BigDecimal("-38.503802"))
    )


    private var indiceCaminhao1 = 0
    private var indiceCaminhao2 = 0

    @Scheduled(fixedRate = 5000)
    fun moverCaminhoes() {
        val caminhao1 = caminhaoRepository.findById(1L)
            .orElseThrow { RuntimeException("Caminhão 1 não encontrado") }

        val caminhao2 = caminhaoRepository.findById(2L)
            .orElseThrow { RuntimeException("Caminhão 2 não encontrado") }

        // Atualiza posições
        val destino1 = rotaSenai[indiceCaminhao1 % rotaSenai.size]
        val destino2 = rotaDique[indiceCaminhao2 % rotaDique.size]

        caminhao1.coordenadas = destino1
        caminhao2.coordenadas = destino2

        caminhaoRepository.save(caminhao1)
        caminhaoRepository.save(caminhao2)

        println("Caminhão 1 movido para: ${destino1.latitude}, ${destino1.longitude}")
        println("Caminhão 2 movido para: ${destino2.latitude}, ${destino2.longitude}")

        verificarPontosProximos(destino1)
        verificarPontosProximos(destino2)

        // Envia via WebSocket
        val payload = mapOf(
            "caminhao1" to mapOf(
                "latitude" to destino1.latitude,
                "longitude" to destino1.longitude,
                "reset" to (indiceCaminhao1 % rotaSenai.size == 0)
            ),
            "caminhao2" to mapOf(
                "latitude" to destino2.latitude,
                "longitude" to destino2.longitude,
                "reset" to (indiceCaminhao2 % rotaDique.size == 0)
            )
        )

        messagingTemplate.convertAndSend("/topic/caminhao-posicao", payload)

        // Incrementa índices independentemente
        indiceCaminhao1++
        indiceCaminhao2++
    }

    private fun verificarPontosProximos(posicaoCaminhao: Geopoint) {
        val pontos = pontoDeColetaRepository.findAll()
        pontos.forEach { ponto ->
            val distancia = GeoUtils.calcularDistanciaKm(posicaoCaminhao, ponto.endereco.coordenadas)
                .setScale(2, RoundingMode.HALF_UP)
            if (distancia <= BigDecimal("0.3")) {
                notificacaoService.enviarNotificacao(
                    titulo = "Caminhão de lixo próximo",
                    mensagem = "O caminhão está a $distancia km do ponto ${ponto.nome}"
                )
            }
        }
    }
}
