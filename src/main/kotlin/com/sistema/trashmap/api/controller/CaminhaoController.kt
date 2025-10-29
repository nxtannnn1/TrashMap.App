package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.CaminhaoDTORequest
import com.sistema.trashmap.api.dto.CaminhaoDTOResponse
import com.sistema.trashmap.application.service.CaminhaoService
import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/caminhoes")
class CaminhaoController(val caminhaoService: CaminhaoService) {

    @PostMapping
    fun cadastrarCaminhao(@RequestBody @Valid caminhaoDTORequest: CaminhaoDTORequest): ResponseEntity<CaminhaoDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(caminhaoService.cadastrarCaminhao(caminhaoDTORequest))

    @PostMapping("/lote")
    fun cadastrarVariosCaminhoes(@RequestBody @Valid caminhoesDTORequest: List<CaminhaoDTORequest>): ResponseEntity<List<CaminhaoDTOResponse>> =
        ResponseEntity.status(HttpStatus.CREATED).body(caminhaoService.cadastrarVariosCaminhoes(caminhoesDTORequest))

    @GetMapping("/{id}")
    fun buscarCaminhaoPorId(@PathVariable id: Long): ResponseEntity<CaminhaoDTOResponse> =
        ResponseEntity.ok(caminhaoService.buscarCaminhaoPorId(id))

    @GetMapping
    fun listarCaminhoes(
        pageable: Pageable,
        @RequestParam(required = false) statusCaminhao: StatusCaminhao? = null,
        @RequestParam(required = false) latitude: BigDecimal?,
        @RequestParam(required = false) longitude: BigDecimal?,
        @RequestParam(required = false) raioKm: BigDecimal? = BigDecimal("5.0"),
        @RequestParam(required = false) placa: String? = null
    ): ResponseEntity<List<CaminhaoDTOResponse>> =
        ResponseEntity.ok(caminhaoService.listarCaminhoes(pageable, statusCaminhao, placa, latitude, longitude, raioKm))

    @PutMapping("/{id}")
    fun editarCaminhaoPorId(
        @PathVariable id: Long,
        @RequestBody @Valid caminhaoDTORequest: CaminhaoDTORequest
    ): ResponseEntity<CaminhaoDTOResponse> =
        ResponseEntity.ok(caminhaoService.editarCaminhaoPorId(id, caminhaoDTORequest))

    @DeleteMapping("/{id}")
    fun excluirCaminhaoPorId(@PathVariable id: Long): ResponseEntity<Void> {
        caminhaoService.excluirCaminhaoPorId(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/status")
    fun atualizarStatusDoCaminhao(
        @PathVariable id: Long,
        @RequestParam(required = true) statusCaminhao: StatusCaminhao
    ): ResponseEntity<CaminhaoDTOResponse> =
        ResponseEntity.ok(caminhaoService.atualizarStatusDoCaminhao(id, statusCaminhao))

    @PatchMapping("/{id}/localizacao")
    fun atualizarLocalizacao(
        @PathVariable id: Long,
        @RequestBody @Valid geopoint: Geopoint
    ): ResponseEntity<CaminhaoDTOResponse> =
        ResponseEntity.ok(caminhaoService.atualizarLocalizacao(id, geopoint))

}