package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.UsuarioDTORequest

fun main() {

    val usuario1 = UsuarioDTORequest(
        email = "joao@hotmail.com",
        nome = "João",
        senha = "joaodatorre",
        tipoUsuario = TipoUsuario.COMUM
    )

    print("Usuário criado $usuario1")

}