package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.request.EnderecoDTORequest
import com.sistema.trashmap.api.dto.response.EnderecoDTOResponse
import com.sistema.trashmap.application.service.EnderecoService
import com.sistema.trashmap.domain.enum.Estado
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/enderecos")
class EnderecoController(val enderecoService: EnderecoService) {

    @PostMapping
    fun cadastrarEndereco(@RequestBody @Valid enderecoDTORequest: EnderecoDTORequest): ResponseEntity<EnderecoDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(enderecoService.cadastrarEndereco(enderecoDTORequest))


    @PostMapping("/lote")
    fun cadastrarVariosEnderecos(@RequestBody @Valid enderecosDTO: List<EnderecoDTORequest>): ResponseEntity<List<EnderecoDTOResponse>> =
        ResponseEntity.status(HttpStatus.CREATED).body(enderecoService.cadastrarVariosEnderecos(enderecosDTO))


    @GetMapping("/{id}")
    fun listarEnderecoPorId(@PathVariable id: Long): ResponseEntity<EnderecoDTOResponse> =
        ResponseEntity.ok(enderecoService.listarEnderecoPorId(id))

    @GetMapping
    fun listarEnderecos(
        pageable: Pageable,
        @RequestParam(required = false) latitude: Double,
        @RequestParam(required = false) longitude: Double,
        @RequestParam(required = false) raioKm: BigDecimal,
        @RequestParam(required = false) cidade: String?,
        @RequestParam(required = false) estado: Estado?
    ): ResponseEntity<List<EnderecoDTOResponse>> =
        ResponseEntity.ok(enderecoService.listarEnderecos(pageable, latitude, longitude, raioKm, cidade, estado))

    @PutMapping("/{id}")
    fun editarEnderecoPorId(
        @PathVariable id: Long,
        @RequestBody @Valid enderecoDTORequest: EnderecoDTORequest
    ): ResponseEntity<EnderecoDTOResponse> =
        ResponseEntity.ok(enderecoService.editarEnderecoPorId(id, enderecoDTORequest))

    @DeleteMapping("/{id}")
    fun excluirEnderecoPorId(@PathVariable id: Long): ResponseEntity<Void> {
        enderecoService.excluirEnderecoPorId(id)
        return ResponseEntity.noContent().build()
    }

}