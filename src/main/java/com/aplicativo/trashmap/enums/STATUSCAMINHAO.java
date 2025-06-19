package com.aplicativo.trashmap.enums;

public enum STATUSCAMINHAO {
    ATIVO ("Ativo"),
    INATIVO ("Inativo"),
    EM_MANUTENCAO ("Em Manutenção");

    private final String descricao;

    STATUSCAMINHAO (String descricao){
        this.descricao=descricao;
    }

    public String getDescricao(){
        return descricao;
    }
}
