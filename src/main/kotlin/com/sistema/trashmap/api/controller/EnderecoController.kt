package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.EnderecoDTORequest
import com.sistema.trashmap.api.dto.EnderecoDTOResponse
import com.sistema.trashmap.application.service.EnderecoService
import com.sistema.trashmap.domain.enum.Estado
import jakarta.validation.Valid
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
    fun listarEnderecos(): ResponseEntity<List<EnderecoDTOResponse>> =
        ResponseEntity.ok(enderecoService.listarEnderecos())


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


    @GetMapping("/proximos")
    fun listarEnderecosProximos(
        @RequestParam latitude: BigDecimal,
        @RequestParam longitude: BigDecimal,
        @RequestParam(required = false, defaultValue = "5.0") raioKm: BigDecimal,
        @RequestParam(required = false) cidade: String?,
        @RequestParam(required = false) estado: Estado?
    ): List<EnderecoDTOResponse> =
        enderecoService.listarEnderecosProximos(
            latitude = latitude,
            longitude = longitude,
            raioKm = raioKm,
            cidade = cidade,
            estado = estado
        )
}