package com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.UsuarioDTORequest
import com.sistema.trashmap.api.dto.request.UsuarioLoginDTORequest
import com.sistema.trashmap.api.dto.response.UsuarioDTOResponse
import com.sistema.trashmap.api.dto.response.UsuarioLoginDTOResponse
import com.sistema.trashmap.api.mapper.LoginMapper
import com.sistema.trashmap.api.mapper.UsuarioMapper
import com.sistema.trashmap.domain.model.Usuario
import com.sistema.trashmap.exception.EmailIncorretoException
import com.sistema.trashmap.exception.EmailJaExistenteException
import com.sistema.trashmap.exception.UsuarioNaoEncontradoException
import com.sistema.trashmap.infrastructure.repository.UsuarioRepository
import com.sistema.trashmap.validation.NomeValidator
import com.sistema.trashmap.validation.SenhaValidator
import main.kotlin.com.sistema.trashmap.exception.SenhaIncorretaException
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UsuarioService(
    val usuarioRepository: UsuarioRepository,
    val passwordEncoder: PasswordEncoder,
    val jwtService: JwtService
) {

    fun cadastrarUsuario(usuarioDTORequest: UsuarioDTORequest): UsuarioDTOResponse {

        if (usuarioRepository.findByEmail(usuarioDTORequest.email) != null) {
            throw EmailJaExistenteException("Já existe um usuário com esse e-mail!")
        }

        NomeValidator.validate(usuarioDTORequest.nome)
        SenhaValidator.validate(usuarioDTORequest.senha)
        val hash = passwordEncoder.encode(usuarioDTORequest.senha)

        val usuario = Usuario(
            email = usuarioDTORequest.email,
            nome = usuarioDTORequest.nome,
            senha = hash
        )

        usuarioRepository.save(usuario)

        return UsuarioMapper.toDto(usuario)

    }

    fun cadastrarVariosUsuarios(usuariosDTO: List<UsuarioDTORequest>): List<UsuarioDTOResponse> {

        val usuarios = usuariosDTO.map { dto ->

            if (usuarioRepository.findByEmail(dto.email) != null) {
                throw EmailJaExistenteException("Já existe um usuário com esse e-mail!")
            }

            val hash = passwordEncoder.encode(dto.senha)

            Usuario(
                email = dto.email,
                nome = dto.nome,
                senha = hash
            )
        }

        usuarioRepository.saveAll(usuarios)
        return usuarios.map { UsuarioMapper.toDto(it) }
    }

    fun listarUsuarioPorId(id: Long): UsuarioDTOResponse =
        UsuarioMapper.toDto(usuarioRepository.findById(id).orElseThrow {
            UsuarioNaoEncontradoException("Usuário de id $id não encontrado!")
        })


    fun listarUsuarios(
        pageable: Pageable,
        email: String?
    ): List<UsuarioDTOResponse> {

        val usuarios: List<Usuario> = when {

            email != null -> {
                val usuario = usuarioRepository.findByEmail(email)
                if (usuario != null) listOf(usuario) else emptyList()
            }

            else -> {
                usuarioRepository.findAll(pageable).content
            }

        }

        return usuarios.map { UsuarioMapper.toDto(it) }

    }

    fun editarUsuarioPorId(id: Long, usuarioDTORequest: UsuarioDTORequest): UsuarioDTOResponse {

        NomeValidator.validate(usuarioDTORequest.nome)

        val hash = passwordEncoder.encode(usuarioDTORequest.senha)

        val usuario: Usuario = usuarioRepository.findById(id).orElseThrow {
            UsuarioNaoEncontradoException("Usuário de id $id não encontrado!")
        }

        if (usuarioRepository.findByEmail(usuarioDTORequest.email) != null && usuarioDTORequest.email != usuario.email) {
            throw EmailJaExistenteException("Já existe um usuário com esse e-mail!")
        }

        usuario.nome = usuarioDTORequest.nome
        usuario.email = usuarioDTORequest.email
        usuario.senha = hash

        usuarioRepository.save(usuario)

        return UsuarioMapper.toDto(usuario)
    }

    fun excluirUsuarioPorId(id: Long) =
        usuarioRepository.delete(
            usuarioRepository.findById(id)
                .orElseThrow { UsuarioNaoEncontradoException("Usuário de id $id não encontrado") })


    fun autenticarLogin(usuarioLoginDTORequest: UsuarioLoginDTORequest): UsuarioLoginDTOResponse {

        val usuario = usuarioRepository.findByEmail(usuarioLoginDTORequest.email)
            ?: throw UsuarioNaoEncontradoException("Usuário não encontrado ou credenciais inválidas.")
        if (!passwordEncoder.matches(
                usuarioLoginDTORequest.senha,
                usuario.senha
            )
        ) throw SenhaIncorretaException("Senha incorreta")

        val token = jwtService.gerarToken(usuario.email)

        return LoginMapper.toDto(usuario, token)
    }

    fun alterarSenha(id: Long, senhaAtual: String, senhaNova: String) {
        val usuario = usuarioRepository.findById(id)
            .orElseThrow { UsuarioNaoEncontradoException("Usuário de id $id não encontrado") }

        if (!passwordEncoder.matches(
                senhaAtual, // Senha inputada pelo usuário raw (crua),
                usuario.senha //Senha já registrada no BD coded (codificada)
            )
        ) throw SenhaIncorretaException("Senha incorreta")

        SenhaValidator.validate(senhaNova)

        usuario.senha = passwordEncoder.encode(senhaNova)
        usuarioRepository.save(usuario)

    }

    fun alterarEmail(id: Long, emailAtual: String, emailNovo: String) {
        val usuario =
            usuarioRepository.findById(id)
                .orElseThrow { UsuarioNaoEncontradoException("Usuário de id $id não encontrado") }

        if (usuario.email != emailAtual) throw EmailIncorretoException("E-mail não confere!")

        if (usuarioRepository.findByEmail(emailAtual) != null) throw EmailJaExistenteException("Já existe um usuário com esse e-mail!")

        usuario.email = emailNovo
        usuarioRepository.save(usuario)
    }


}


