package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.PontoDeColetaDTORequest
import com.sistema.trashmap.api.dto.PontoDeColetaDTOResponse
import com.sistema.trashmap.application.service.PontoDeColetaService
import com.sistema.trashmap.domain.enum.Estado
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/pontos-de-coleta")
class PontoDeColetaController(val pontoDeColetaService: PontoDeColetaService) {

    @PostMapping
    fun cadastrarPonto(@RequestBody @Valid pontoDeColetaDTORequest: PontoDeColetaDTORequest): ResponseEntity<PontoDeColetaDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(pontoDeColetaService.cadastrarPonto(pontoDeColetaDTORequest))

    @PostMapping("/lote")
    fun cadastrarVariosPontos(@RequestBody @Valid pontoDeColetaDTORequest: List<PontoDeColetaDTORequest>): ResponseEntity<List<PontoDeColetaDTOResponse>> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(pontoDeColetaService.cadastrarVariosPontos(pontoDeColetaDTORequest))

    @GetMapping("/{id}")
    fun listarPontoPorId(@PathVariable id: Long): ResponseEntity<PontoDeColetaDTOResponse> =
        ResponseEntity.ok(pontoDeColetaService.listarPontoPorId(id))

    @GetMapping
    fun listarPontos(@RequestParam estado: Estado?): ResponseEntity<List<PontoDeColetaDTOResponse>> =
        ResponseEntity.ok(pontoDeColetaService.listarPontos(estado))


    @PutMapping("/{id}")
    fun editarPontoPorId(
        @PathVariable id: Long,
        @RequestBody pontoDeColetaDTORequest: PontoDeColetaDTORequest
    ): ResponseEntity<PontoDeColetaDTOResponse> =
        ResponseEntity.ok(pontoDeColetaService.editarPontoPorId(id, pontoDeColetaDTORequest))

    @DeleteMapping("/{id}")
    fun excluirPontoPorId(@PathVariable id: Long): ResponseEntity<Void> {
        pontoDeColetaService.excluirPontoPorId(id)
        return ResponseEntity.noContent().build()
    }

}