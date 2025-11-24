package com.sistema.trashmap.api.exceptionhandler

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

// Lista de exceções personalizadas
open class AppException(message: String?) : RuntimeException(message)

//Não existe
class CaminhaoNaoEncontrado(message: String?) : AppException(message)
class PlacaNaoExiste(message: String?) : AppException(message)
class PontoNaoEncontrado(message: String?) : AppException(message)
class UsuarioNaoEncontrado(message: String?) : AppException(message)
class RotaNaoEncontrada(message: String?) : AppException(message)

//Duplicidade
class EmailExiste(message: String?) : AppException(message)
class PlacaJaExistente(message: String?) : AppException(message)

//Dados inválidos
class CepInvalido(message: String?) : AppException(message)
class EnderecoNaoEncontrado(message: String?) : AppException(message)
class PlacaInvalida(message: String?) : AppException(message)
class SenhaInvalida(message: String?) : AppException(message)
class NomeInvalido(message: String?) : AppException(message)
class SenhaIncorreta(message: String?) : AppException(message)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<Any> {
        val errors = ex.bindingResult.fieldErrors.map {
            "O campo '${it.field}' ${it.defaultMessage}"
        }
        val errorResponse = mapOf(
            "status" to HttpStatus.BAD_REQUEST.value(),
            "erro" to "Dados de requisição inválidos",
            "detalhes" to errors
        )
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(AppException::class)
    fun handleAppExceptions(ex: AppException): ResponseEntity<Any> {
        val status = when (ex) {
            is CaminhaoNaoEncontrado,
            is EnderecoNaoEncontrado,
            is PontoNaoEncontrado,
            is UsuarioNaoEncontrado,
            is RotaNaoEncontrada,
            is PlacaNaoExiste -> HttpStatus.NOT_FOUND

            is CepInvalido,
            is PlacaInvalida,
            is SenhaInvalida,
            is NomeInvalido,
            is SenhaIncorreta -> HttpStatus.BAD_REQUEST

            is EmailExiste,
            is PlacaJaExistente -> HttpStatus.CONFLICT

            else -> HttpStatus.INTERNAL_SERVER_ERROR
        }

        val errorResponse = mapOf(
            "status" to status.value(),
            "erro" to ex.javaClass.simpleName.replace(Regex("([A-Z])"), " $1").trim(),
            "detalhes" to (ex.message ?: "Erro inesperado")
        )
        return ResponseEntity(errorResponse, status)
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<Any> {
        val errorResponse = mapOf(
            "status" to HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "erro" to "Erro interno no servidor",
            "detalhes" to ex.message
        )
        return ResponseEntity(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
