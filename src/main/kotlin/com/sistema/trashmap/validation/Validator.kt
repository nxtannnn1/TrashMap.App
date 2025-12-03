package com.sistema.trashmap.validation

interface Validator<T> {
    fun validate(entity: T)
}