package manual_testing.com.sistema.trashmap.application.service

import com.sistema.trashmap.api.dto.request.EnderecoDTORequest
import com.sistema.trashmap.api.dto.request.PontoDeColetaDTORequest
import com.sistema.trashmap.domain.enum.Estado
import com.sistema.trashmap.domain.model.Geopoint
import java.math.BigDecimal

fun main() {

    val ponto1 = PontoDeColetaDTORequest(
        coordenadas = Geopoint(latitude = BigDecimal("23.512"), longitude = BigDecimal("12.9344")),
        endereco = EnderecoDTORequest(
            logradouro = "Avenida Maria Dusá",
            numero = "26",
            bairro = "Engenho Velho de Brotas",
            cidade = "Salvador",
            cep = "40240220",
            estado = Estado.BA,
            coordenadas = Geopoint(latitude = BigDecimal("41.40338"), BigDecimal("34.17403"))
        ),
        nome = "Ponto do Dique"
    )

    print("Ponto criado $ponto1")

}