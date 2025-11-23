package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.request.RotaDTORequest
import com.sistema.trashmap.api.dto.response.RotaDTOResponse
import com.sistema.trashmap.application.service.RotaService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/rotas")
class RotaController(val rotaService: RotaService) {

    @PostMapping
    fun cadastrarRota(@RequestBody @Valid rotaDTORequest: RotaDTORequest): ResponseEntity<RotaDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(rotaService.cadastrarRota(rotaDTORequest))

    @GetMapping
    fun listarRotas(pageable: Pageable): ResponseEntity<Page<RotaDTOResponse>> =
        ResponseEntity.ok(rotaService.listarRotas(pageable))

    @GetMapping("/{id}")
    fun listarRotaPorId(@PathVariable id: Long): ResponseEntity<RotaDTOResponse> =
        ResponseEntity.ok(rotaService.listarRotaPorId(id))

    @DeleteMapping("/{id}")
    fun excluirRotaPorId(@PathVariable id: Long): ResponseEntity<Void> {
        rotaService.excluirRotaPorId(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}")
    fun atualizarRotaPorId(
        @PathVariable id: Long,
        @RequestBody @Valid rotaDTORequest: RotaDTORequest
    ): ResponseEntity<RotaDTOResponse> =
        ResponseEntity.ok(rotaService.atualizarRotaPorId(id, rotaDTORequest))
    
}