package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.request.UsuarioDTORequest
import com.sistema.trashmap.api.dto.request.UsuarioLoginDTORequest
import com.sistema.trashmap.api.dto.response.UsuarioDTOResponse
import com.sistema.trashmap.api.dto.response.UsuarioLoginDTOResponse
import com.sistema.trashmap.application.service.UsuarioService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("/auth")
class AuthController (val usuarioService: UsuarioService){

    @PostMapping("/login")
    fun autenticarLogin(@RequestBody @Valid usuarioLoginDTORequest: UsuarioLoginDTORequest): ResponseEntity<UsuarioLoginDTOResponse> =
        ResponseEntity.ok(usuarioService.autenticarLogin(usuarioLoginDTORequest))

    @PostMapping
    fun cadastrarUsuario(@RequestBody @Valid usuarioDTORequest: UsuarioDTORequest): ResponseEntity<UsuarioDTOResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrarUsuario(usuarioDTORequest))
}