const BASE_PONTOS = "http://localhost:8080/pontos-de-coleta";

// Cadastrar ponto único
function cadastrarPonto() {
    const data = {
        nome: document.getElementById("nomePonto").value,
        endereco: {
            logradouro: document.getElementById("logradouroPonto").value,
            numero: document.getElementById("numeroPonto").value,
            bairro: document.getElementById("bairroPonto").value,
            cidade: document.getElementById("cidadePonto").value,
            cep: document.getElementById("cepPonto").value,
            estado: document.getElementById("estadoPonto").value,
            coordenadas: {
                latitude: parseFloat(document.getElementById("latitudePonto").value),
                longitude: parseFloat(document.getElementById("longitudePonto").value)
            }
        },
        coordenadas: {
            latitude: parseFloat(document.getElementById("latitudePonto").value),
            longitude: parseFloat(document.getElementById("longitudePonto").value)
        }
    };

    fetch(BASE_PONTOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resCadastrarPonto").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resCadastrarPonto").innerText = err);
}

// Cadastrar lote de pontos
function cadastrarLotePontos() {
    let data;
    try {
        data = JSON.parse(document.getElementById("jsonLotePontos").value);
    } catch(e) {
        document.getElementById("resCadastrarLote").innerText = "JSON inválido";
        return;
    }

    fetch(`${BASE_PONTOS}/lote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resCadastrarLote").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resCadastrarLote").innerText = err);
}

// Listar pontos (com filtro por UF)
function listarPontos() {
    const estado = document.getElementById("filtroEstado").value;
    const url = estado ? `${BASE_PONTOS}?estado=${estado}` : BASE_PONTOS;

    fetch(url)
        .then(res => res.json())
        .then(json => document.getElementById("resListarPontos").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resListarPontos").innerText = err);
}

// Buscar por ID
function buscarPontoPorId() {
    const id = document.getElementById("idBuscarPonto").value;
    fetch(`${BASE_PONTOS}/${id}`)
        .then(res => res.json())
        .then(json => document.getElementById("resBuscarPonto").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resBuscarPonto").innerText = err);
}

// Editar ponto
function editarPonto() {
    const id = document.getElementById("idEditarPonto").value;
    const data = {
        nome: document.getElementById("nomeEditar").value,
        endereco: {
            logradouro: document.getElementById("logradouroEditar").value,
            numero: document.getElementById("numeroEditar").value,
            bairro: document.getElementById("bairroEditar").value,
            cidade: document.getElementById("cidadeEditar").value,
            cep: document.getElementById("cepEditar").value,
            estado: document.getElementById("estadoEditar").value,
            coordenadas: {
                latitude: parseFloat(document.getElementById("latitudeEditar").value),
                longitude: parseFloat(document.getElementById("longitudeEditar").value)
            }
        },
        coordenadas: {
            latitude: parseFloat(document.getElementById("latitudeEditar").value),
            longitude: parseFloat(document.getElementById("longitudeEditar").value)
        }
    };

    fetch(`${BASE_PONTOS}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resEditarPonto").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resEditarPonto").innerText = err);
}

// Excluir ponto
function excluirPonto() {
    const id = document.getElementById("idExcluirPonto").value;
    fetch(`${BASE_PONTOS}/${id}`, {method: "DELETE"})
        .then(res => document.getElementById("resExcluirPonto").innerText = "Excluído com sucesso!")
        .catch(err => document.getElementById("resExcluirPonto").innerText = err);
}
