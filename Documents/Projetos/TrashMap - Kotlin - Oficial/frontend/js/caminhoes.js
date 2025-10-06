const baseURL = 'http://localhost:8080/caminhoes';

// Cadastrar Caminhão
async function cadastrarCaminhao() {
    const data = {
        placa: document.getElementById('placa').value,
        coordenadas: {
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value)
        },
        statusCaminhao: document.getElementById('status').value,
        capacidadeKg: parseFloat(document.getElementById('capacidade').value)
    };
    const res = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    document.getElementById('resCadastrar').textContent = JSON.stringify(await res.json(), null, 2);
}

// Cadastrar vários caminhões
async function cadastrarLote() {
    try {
        const data = JSON.parse(document.getElementById('jsonLote').value);
        data.forEach(c => {
            if (!c.coordenadas) {
                c.coordenadas = { latitude: c.latitude, longitude: c.longitude };
            }
        });
        const res = await fetch(`${baseURL}/lote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        document.getElementById('resLote').textContent = JSON.stringify(await res.json(), null, 2);
    } catch(e) {
        document.getElementById('resLote').textContent = 'JSON inválido';
    }
}

// Listar todos
async function listarCaminhoes() {
    const res = await fetch(baseURL);
    document.getElementById('resListar').textContent = JSON.stringify(await res.json(), null, 2);
}

// Buscar por ID
async function buscarPorId() {
    const id = document.getElementById('idBuscar').value;
    const res = await fetch(`${baseURL}/${id}`);
    document.getElementById('resBuscar').textContent = JSON.stringify(await res.json(), null, 2);
}

// Editar Caminhão
async function editarCaminhao() {
    const id = document.getElementById('idEditar').value;
    const data = {
        placa: document.getElementById('placaEditar').value,
        coordenadas: {
            latitude: parseFloat(document.getElementById('latEditar').value),
            longitude: parseFloat(document.getElementById('longEditar').value)
        },
        statusCaminhao: document.getElementById('statusEditar').value,
        capacidadeKg: parseFloat(document.getElementById('capacidadeEditar').value)
    };
    const res = await fetch(`${baseURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    document.getElementById('resEditar').textContent = JSON.stringify(await res.json(), null, 2);
}

// Excluir Caminhão
async function excluirCaminhao() {
    const id = document.getElementById('idExcluir').value;
    const res = await fetch(`${baseURL}/${id}`, { method: 'DELETE' });
    document.getElementById('resExcluir').textContent = res.ok ? "Excluído com sucesso" : "Erro ao excluir";
}

// Atualizar status
async function atualizarStatus() {
    const id = document.getElementById('idStatus').value;
    const status = document.getElementById('novoStatus').value;
    const res = await fetch(`${baseURL}/${id}/status?statusCaminhao=${status}`, { method: 'PATCH' });
    document.getElementById('resStatus').textContent = JSON.stringify(await res.json(), null, 2);
}

// Atualizar localização
async function atualizarLocalizacao() {
    const id = document.getElementById('idLocal').value;
    const data = {
        latitude: parseFloat(document.getElementById('latLocal').value),
        longitude: parseFloat(document.getElementById('longLocal').value)
    };
    const res = await fetch(`${baseURL}/${id}/localizacao`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    document.getElementById('resLocal').textContent = JSON.stringify(await res.json(), null, 2);
}
