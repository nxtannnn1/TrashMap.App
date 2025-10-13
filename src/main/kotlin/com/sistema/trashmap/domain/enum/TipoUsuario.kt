package com.sistema.trashmap.domain.enum

enum class TipoUsuario(val descricao: String) {

    COMUM("Comum"),
    //Usuário padrão, população

    ADMIN("Administrador");
    //Administrativo, gerencia usuários, edita permissões e visualiza métricas

}

