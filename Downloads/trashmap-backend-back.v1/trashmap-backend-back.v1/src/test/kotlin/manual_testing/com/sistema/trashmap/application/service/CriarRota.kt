package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.domain.model.Geopoint
import com.sistema.trashmap.domain.model.Rota

fun main() {

    val rota1 = Rota(
        id = null,
        nome = "Rota SENAI",
        pontoDeColetaId = 1L,
        coordenadas = listOf(
            Geopoint(
                latitude = -12.932365025683284, longitude = -38.507123296179934
            ),
            Geopoint(
                latitude = -12.931778, longitude = -38.507216
            ),
            Geopoint(
                latitude = (-12.931259), longitude = -38.507262
            ),
            Geopoint(
                latitude = -12.928952, longitude = -38.507570
            ),

            Geopoint(
                latitude = -12.927311, longitude = -38.507737
            )
        )
    )

    print("Rota criada $rota1\n${rota1.coordenadas}")
}