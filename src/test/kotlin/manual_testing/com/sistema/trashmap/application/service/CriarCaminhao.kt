package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint

fun main() {
    val caminhao1 = CaminhaoDTORequest(
        placa = "ABC-1234",
        statusCaminhao = StatusCaminhao.ATIVO,
        coordenadas = Geopoint(latitude = 12.3456, longitude = -45.6789)
    )

    print("Caminhao criado $caminhao1")
}