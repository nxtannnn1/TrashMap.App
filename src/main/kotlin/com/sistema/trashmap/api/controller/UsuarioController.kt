package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.request.UsuarioDTORequest
import com.sistema.trashmap.api.dto.response.UsuarioDTOResponse
import com.sistema.trashmap.application.service.UsuarioService
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/usuarios")
class UsuarioController(val usuarioService: UsuarioService) {

    @PostMapping("/lote")
    fun cadastrarVariosUsuarios(@RequestBody @Valid usuarioDTORequest: List<UsuarioDTORequest>): ResponseEntity<List<UsuarioDTOResponse>> =
        ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrarVariosUsuarios(usuarioDTORequest))

    @GetMapping("/{id}")
    fun listarUsuarioPorId(@PathVariable id: Long): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.ok(usuarioService.listarUsuarioPorId(id))

    @GetMapping
    fun listarUsuarios(
        pageable: Pageable,
        @RequestParam(required = false) email: String?
    ): ResponseEntity<List<UsuarioDTOResponse>> =
        ResponseEntity.ok(usuarioService.listarUsuarios(pageable, email))

    @PutMapping("/{id}")
    fun editarUsuarioPorId(
        @PathVariable id: Long,
        @RequestBody @Valid usuarioDTORequest: UsuarioDTORequest
    ): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.ok(usuarioService.editarUsuarioPorId(id, usuarioDTORequest))

    @DeleteMapping("/{id}")
    fun excluirUsuarioPorId(@PathVariable id: Long): ResponseEntity<Void> {
        usuarioService.excluirUsuarioPorId(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/alterar-senha")
    fun alterarSenha(
        @PathVariable id: Long,
        @RequestParam(required = true) senhaAtual: String,
        @RequestParam(required = true) senhaNova: String
    ): ResponseEntity<Void> {
        usuarioService.alterarSenha(id, senhaAtual, senhaNova)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/alterar-email")
    fun alterarEmail(
        @PathVariable id: Long,
        @RequestParam(required = true) emailAtual: String,
        @RequestParam(required = true) emailNovo: String
    ): ResponseEntity<Void> {
        usuarioService.alterarEmail(id, emailAtual, emailNovo)
        return ResponseEntity.noContent().build()
    }
}