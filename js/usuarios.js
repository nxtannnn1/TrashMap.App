const BASE_USUARIOS = "http://localhost:8080/usuarios";

function cadastrarUsuario() {
    const usuario = {
        nome: document.getElementById("nomeUsuario").value,
        email: document.getElementById("emailUsuario").value,
        senha: document.getElementById("senhaUsuario").value,
        tipoUsuario: document.getElementById("tipoUsuario").value
    };

    fetch(BASE_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(res => res.json())
    .then(json => document.getElementById("resCadastrarUsuario").innerText = JSON.stringify(json, null, 2))
    .catch(err => document.getElementById("resCadastrarUsuario").innerText = err);
}

function listarUsuarios() {
    fetch(BASE_USUARIOS)
        .then(res => res.json())
        .then(json => document.getElementById("resListarUsuarios").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resListarUsuarios").innerText = err);
}

function buscarUsuarioPorId() {
    const id = document.getElementById("idBuscarUsuario").value;
    fetch(`${BASE_USUARIOS}/${id}`)
        .then(res => res.json())
        .then(json => document.getElementById("resBuscarUsuario").innerText = JSON.stringify(json, null, 2))
        .catch(err => document.getElementById("resBuscarUsuario").innerText = err);
}

function editarUsuario() {
    const id = document.getElementById("idEditarUsuario").value;
    const usuario = {
        nome: document.getElementById("nomeEditarUsuario").value,
        email: document.getElementById("emailEditarUsuario").value,
        senha: document.getElementById("senhaEditarUsuario").value,
        tipoUsuario: document.getElementById("tipoEditarUsuario").value
    };

    fetch(`${BASE_USUARIOS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(res => res.json())
    .then(json => document.getElementById("resEditarUsuario").innerText = JSON.stringify(json, null, 2))
    .catch(err => document.getElementById("resEditarUsuario").innerText = err);
}

function excluirUsuario() {
    const id = document.getElementById("idExcluirUsuario").value;

    fetch(`${BASE_USUARIOS}/${id}`, {
        method: "DELETE"
    })
    .then(() => document.getElementById("resExcluirUsuario").innerText = `Usuário ${id} excluído com sucesso.`)
    .catch(err => document.getElementById("resExcluirUsuario").innerText = err);
}
