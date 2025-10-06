const BASE_ENDERECOS = "http://localhost:8080/enderecos";

// Cadastrar endereço único
function cadastrarEndereco() {
    const data = {
        logradouro: document.getElementById("logradouroEndereco").value,
        numero: document.getElementById("numeroEndereco").value,
        bairro: document.getElementById("bairroEndereco").value,
        cidade: document.getElementById("cidadeEndereco").value,
        cep: document.getElementById("cepEndereco").value,
        estado: document.getElementById("estadoEndereco").value,
        coordenadas: {
            latitude: parseFloat(document.getElementById("latitudeEndereco").value),
            longitude: parseFloat(document.getElementById("longitudeEndereco").value)
        }
    };

    fetch(BASE_ENDERECOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resCadastrarEndereco").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resCadastrarEndereco").innerText = err);
}

// Cadastrar lote
function cadastrarLoteEnderecos() {
    let data;
    try {
        data = JSON.parse(document.getElementById("jsonLoteEnderecos").value);
    } catch(e) {
        document.getElementById("resCadastrarLoteEndereco").innerText = "JSON inválido";
        return;
    }

    fetch(`${BASE_ENDERECOS}/lote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resCadastrarLoteEndereco").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resCadastrarLoteEndereco").innerText = err);
}

// Listar todos endereços
function listarEnderecos() {
    fetch(BASE_ENDERECOS)
        .then(res => res.json())
        .then(json => document.getElementById("resListarEnderecos").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resListarEnderecos").innerText = err);
}

// Buscar por ID
function buscarEnderecoPorId() {
    const id = document.getElementById("idBuscarEndereco").value;
    fetch(`${BASE_ENDERECOS}/${id}`)
        .then(res => res.json())
        .then(json => document.getElementById("resBuscarEndereco").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resBuscarEndereco").innerText = err);
}

// Editar endereço
function editarEndereco() {
    const id = document.getElementById("idEditarEndereco").value;
    const data = {
        logradouro: document.getElementById("logradouroEditar").value,
        numero: document.getElementById("numeroEditar").value,
        bairro: document.getElementById("bairroEditar").value,
        cidade: document.getElementById("cidadeEditar").value,
        cep: document.getElementById("cepEditar").value,
        estado: document.getElementById("estadoEditarEndereco").value,
        coordenadas: {
            latitude: parseFloat(document.getElementById("latitudeEditarEndereco").value),
            longitude: parseFloat(document.getElementById("longitudeEditarEndereco").value)
        }
    };

    fetch(`${BASE_ENDERECOS}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => document.getElementById("resEditarEndereco").innerText = JSON.stringify(json, null, 2))
      .catch(err => document.getElementById("resEditarEndereco").innerText = err);
}

// Excluir endereço
function excluirEndereco() {
    const id = document.getElementById("idExcluirEndereco").value;
    fetch(`${BASE_ENDERECOS}/${id}`, {method: "DELETE"})
        .then(res => document.getElementById("resExcluirEndereco").innerText = "Excluído com sucesso!")
        .catch(err => document.getElementById("resExcluirEndereco").innerText = err);
}

// Listar próximos endereços
function listarProximosEnderecos() {
    const lat = document.getElementById("latitudeProx").value;
    const long = document.getElementById("longitudeProx").value;
    const raio = document.getElementById("raioProx").value || 5.0;
    const cidade = document.getElementById("cidadeProx").value;
    const estado = document.getElementById("estadoProx").value;

    let url = `${BASE_ENDERECOS}/proximos?latitude=${lat}&longitude=${long}&raioKm=${raio}`;
    if(cidade) url += `&cidade=${cidade}`;
    if(estado) url += `&estado=${estado}`;

    fetch(url)
        .then(res => res.json())
        .then(json => document.getElementById("resProximosEnderecos").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resProximosEnderecos").innerText = err);
}
