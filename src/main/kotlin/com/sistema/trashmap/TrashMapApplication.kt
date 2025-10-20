package com.sistema.trashmap

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [
	org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration::class
])

class TrashMapApplication

fun main(args: Array<String>) {
	runApplication<TrashMapApplication>(*args)
}
