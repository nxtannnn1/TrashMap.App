
package com.sistema.trashmap.api.controller

import com.sistema.trashmap.api.dto.request.UsuarioLoginDTORequest
import com.sistema.trashmap.api.dto.response.UsuarioLoginDTOResponse
import com.sistema.trashmap.application.service.UsuarioService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = ["*"])
class AuthController(val usuarioService: UsuarioService) {

    @PostMapping("/login")
    fun login(@RequestBody @Valid usuarioLoginDTORequest: UsuarioLoginDTORequest): ResponseEntity<UsuarioLoginDTOResponse> {
        println("📥 Login recebido (POST): ${usuarioLoginDTORequest.email}")
        return ResponseEntity.ok(usuarioService.autenticarLogin(usuarioLoginDTORequest))
    }

    // ⚠️ ADICIONE ESTE ENDPOINT PARA TESTE NO NAVEGADOR
    @GetMapping("/login")
    fun loginGet(): ResponseEntity<String> {
        println("📥 Acesso via GET em /auth/login")
        return ResponseEntity.ok("""
            ✅ Rota de login funcionando!
            
            Esta rota requer método POST. Use:
            
            Método: POST
            URL: http://localhost:8080/auth/login
            Headers: Content-Type: application/json
            Body: {
              "email": "admin1@trashmap.com",
              "senha": "AdmTrashMap"
            }
            
            Status: Operacional
        """.trimIndent())
    }
}
