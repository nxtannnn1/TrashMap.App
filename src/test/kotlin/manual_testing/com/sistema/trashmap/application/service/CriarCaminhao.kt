package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.CaminhaoDTORequest
import com.sistema.trashmap.domain.enum.StatusCaminhao
import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal

fun main() {
    val caminhao1 = CaminhaoDTORequest(
    placa = "ABC-1234",
    statusCaminhao = StatusCaminhao.ATIVO,
    coordenadas = Geopoint(latitude = BigDecimal("12.3456"), longitude = BigDecimal("-45.6789")),
    capacidadeKg = BigDecimal("1000")
    )

print("Caminhao criado $caminhao1")
}