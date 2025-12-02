package com.sistema.trashmap.application.service

import org.springframework.stereotype.Service

@Service
class NotificacaoService {

    fun enviarNotificacao(titulo: String, mensagem: String) {
        println("[$titulo] $mensagem")
    }
}