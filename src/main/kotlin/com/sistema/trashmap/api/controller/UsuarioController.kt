package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.UsuarioDTORequest
import com.sistema.trashmap.api.dto.UsuarioDTOResponse
import com.sistema.trashmap.api.dto.UsuarioLoginDTORequest
import com.sistema.trashmap.api.dto.UsuarioLoginDTOResponse
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

    @PostMapping("/login")
    fun autenticarLogin(@RequestBody @Valid usuarioLoginDTORequest: UsuarioLoginDTORequest): ResponseEntity<UsuarioLoginDTOResponse> =
        ResponseEntity.ok(usuarioService.autenticarLogin(usuarioLoginDTORequest))

    @PostMapping
    fun cadastrarUsuario(@RequestBody @Valid usuarioDTORequest: UsuarioDTORequest): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrarUsuario(usuarioDTORequest))

    @PostMapping("/lote")
    fun cadastrarVariosUsuarios(@RequestBody @Valid usuarioDTORequest: List<UsuarioDTORequest>): ResponseEntity<List<UsuarioDTOResponse>> =
        ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrarVariosUsuarios(usuarioDTORequest))

    @GetMapping("/{id}")
    fun listarUsuarioPorId(@PathVariable id: Long): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.ok(usuarioService.listarUsuarioPorId(id))

    @GetMapping
    fun listarUsuarios(pageable: Pageable, @RequestParam(required = false) email: String?): ResponseEntity<List<UsuarioDTOResponse>> =
        ResponseEntity.ok(usuarioService.listarUsuarios(pageable, email))

    @PutMapping("/{id}")
    fun editarUsuarioPorId(
        @PathVariable id: Long,
        @RequestBody @Valid usuarioDTORequest: UsuarioDTORequest
    ): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.ok(usuarioService.editarUsuarioPorId(id, usuarioDTORequest))

    @DeleteMapping("/{id}")
    fun excluirUsuarioPorId(@PathVariable id: Long) =
        usuarioService.excluirUsuarioPorId(id)

}