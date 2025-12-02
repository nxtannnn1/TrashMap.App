// src/main/kotlin/com/sistema/trashmap/infrastructure/init/PontosInitializer.kt
package com.sistema.trashmap.infrastructure.init

import com.sistema.trashmap.infrastructure.presets.PontosPreset
import com.sistema.trashmap.infrastructure.presets.EnderecoPreset
import com.sistema.trashmap.infrastructure.repository.PontoDeColetaRepository
import com.sistema.trashmap.infrastructure.repository.EnderecoRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class PontosInitializer(
    val pontoDeColetaRepository: PontoDeColetaRepository,
    val enderecoRepository: EnderecoRepository // ← ADICIONAR ISSO
) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (pontoDeColetaRepository.count() == 0L) {
            // 1. SALVAR ENDEREÇOS PRIMEIRO
            val enderecoSenaiSalvo = enderecoRepository.save(EnderecoPreset.enderecoSenai)
            val enderecoDiqueSalvo = enderecoRepository.save(EnderecoPreset.enderecoDique)

            // 2. CRIAR NOVOS PONTOS COM OS ENDEREÇOS JÁ SALVOS
            val pontoSenai = PontosPreset.pontoSenai.apply {
                this.endereco = enderecoSenaiSalvo
            }
            val pontoDique = PontosPreset.pontoDique.apply {
                this.endereco = enderecoDiqueSalvo
            }

            // 3. AGORA SIM SALVAR OS PONTOS
            pontoDeColetaRepository.saveAll(listOf(pontoSenai, pontoDique))

            println("✅ Pontos de coleta inicializados com sucesso!")
        } else {
            println("ℹ️ Pontos já inicializados")
        }
    }
}