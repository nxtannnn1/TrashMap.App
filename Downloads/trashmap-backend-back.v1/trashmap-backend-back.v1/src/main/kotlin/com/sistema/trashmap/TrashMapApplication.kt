package com.sistema.trashmap

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class TrashMapApplication

fun main(args: Array<String>) {
	runApplication<TrashMapApplication>(*args)
}
