package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.EnderecoDTORequest
import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal

fun main() {

    val endereco1 = EnderecoDTORequest(
        logradouro = "Avenida Maria Dusá",
        numero = "26",
        bairro = "Engenho Velho de Brotas",
        cidade = "Salvador",
        cep = "40240220",
        estado = Estado.BA,
        coordenadas = Geopoint(latitude = BigDecimal("41.40338"), BigDecimal("34.17403"))
    )

    print("Endereço criado $endereco1")

}