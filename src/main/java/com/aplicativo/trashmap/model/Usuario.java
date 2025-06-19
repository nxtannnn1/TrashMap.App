package com.aplicativo.trashmap.model;

import jakarta.persistence.Id;

public abstract class Usuario {

    @Id
    private Long id;

    private String nome;
    private String email;
}
