// src/pages/Pontos.jsx
import React, { useState } from 'react';

const BASE_PONTOS = "http://localhost:8080/pontos-de-coleta";

// Helper para evitar repetição de <option>
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

const EstadosOptions = () => (
  <>
    {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
  </>
);

function Pontos() {
  // ==========================================================
  // 1. STATES para controlar os formulários
  // ==========================================================
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: 'AC',
    latitude: '',
    longitude: ''
  });

  const [formEditar, setFormEditar] = useState({
    id: '',
    nome: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: 'AC',
    latitude: '',
    longitude: ''
  });

  const [jsonLotePontos, setJsonLotePontos] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [idBuscarPonto, setIdBuscarPonto] = useState('');
  const [idExcluirPonto, setIdExcluirPonto] = useState('');

  // ==========================================================
  // 2. STATES para guardar as respostas (o conteúdo dos <pre>)
  // ==========================================================
  const [resCadastrarPonto, setResCadastrarPonto] = useState('');
  const [resCadastrarLote, setResCadastrarLote] = useState('');
  const [resListarPontos, setResListarPontos] = useState('');
  const [resBuscarPonto, setResBuscarPonto] = useState('');
  const [resEditarPonto, setResEditarPonto] = useState('');
  const [resExcluirPonto, setResExcluirPonto] = useState('');

  // ==========================================================
  // 3. Handlers para atualizar os states
  // ==========================================================
  const handleFormChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper para montar o corpo (body) da requisição
  const buildPontoData = (formData) => {
    const lat = parseFloat(formData.latitude);
    const long = parseFloat(formData.longitude);
    return {
      nome: formData.nome,
      endereco: {
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        cep: formData.cep,
        estado: formData.estado,
        coordenadas: { latitude: lat, longitude: long }
      },
      coordenadas: { latitude: lat, longitude: long }
    };
  };

  // ==========================================================
  // 4. Funções de "fetch" (adaptadas do seu pontos.js)
  // ==========================================================

  // Cadastrar ponto único
  async function cadastrarPonto() {
    try {
      const data = buildPontoData(formCadastro);
      const res = await fetch(BASE_PONTOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResCadastrarPonto(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResCadastrarPonto(`Erro: ${err.message}`);
    }
  }

  // Cadastrar lote de pontos
  async function cadastrarLotePontos() {
    let data;
    try {
      data = JSON.parse(jsonLotePontos);
    } catch(e) {
      setResCadastrarLote("JSON inválido");
      return;
    }

    try {
      const res = await fetch(`${BASE_PONTOS}/lote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResCadastrarLote(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResCadastrarLote(`Erro: ${err.message}`);
    }
  }

  // Listar pontos (com filtro por UF)
  async function listarPontos() {
    try {
      const url = filtroEstado ? `${BASE_PONTOS}?estado=${filtroEstado}` : BASE_PONTOS;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResListarPontos(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResListarPontos(`Erro: ${err.message}`);
    }
  }

  // Buscar por ID
  async function buscarPontoPorId() {
    try {
      const res = await fetch(`${BASE_PONTOS}/${idBuscarPonto}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResBuscarPonto(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResBuscarPonto(`Erro: ${err.message}`);
    }
  }

  // Editar ponto
  async function editarPonto() {
    try {
      const data = buildPontoData(formEditar);
      const res = await fetch(`${BASE_PONTOS}/${formEditar.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResEditarPonto(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResEditarPonto(`Erro: ${err.message}`);
    }
  }

  // Excluir ponto
  async function excluirPonto() {
    try {
      const res = await fetch(`${BASE_PONTOS}/${idExcluirPonto}`, {method: "DELETE"});
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResExcluirPonto("Excluído com sucesso!");
    } catch (err) {
      setResExcluirPonto(`Erro: ${err.message}`);
    }
  }

  // ==========================================================
  // 5. O JSX (HTML convertido)
  // ==========================================================
  return (
    <>
      <h2>Pontos de Coleta</h2>

      {/* Cadastrar Ponto */}
      <div className="section">
        <h3>Cadastrar Ponto</h3>
        <input name="nome" placeholder="Nome do Ponto" value={formCadastro.nome} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="logradouro" placeholder="Logradouro" value={formCadastro.logradouro} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="numero" placeholder="Número" value={formCadastro.numero} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="bairro" placeholder="Bairro" value={formCadastro.bairro} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="cidade" placeholder="Cidade" value={formCadastro.cidade} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="cep" placeholder="CEP" value={formCadastro.cep} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <select name="estado" value={formCadastro.estado} onChange={(e) => handleFormChange(e, setFormCadastro)}>
          <EstadosOptions />
        </select>
        <input name="latitude" placeholder="Latitude" value={formCadastro.latitude} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="longitude" placeholder="Longitude" value={formCadastro.longitude} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <button onClick={cadastrarPonto}>Cadastrar</button>
        {resCadastrarPonto && <pre>{resCadastrarPonto}</pre>}
      </div>

      {/* Cadastrar Vários Pontos */}
      <div className="section">
        <h3>Cadastrar Lote de Pontos (JSON Array)</h3>
        <textarea 
          value={jsonLotePontos} 
          onChange={(e) => setJsonLotePontos(e.target.value)}
          placeholder='[{"nome":"Ponto A","logradouro":"Rua X",...}]'
        ></textarea>
        <button onClick={cadastrarLotePontos}>Cadastrar Lote</button>
        {resCadastrarLote && <pre>{resCadastrarLote}</pre>}
      </div>

      {/* Listar Pontos */}
      <div className="section">
        <h3>Listar Pontos</h3>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos</option>
          <EstadosOptions />
        </select>
        <button onClick={listarPontos}>Listar</button>
        {resListarPontos && <pre>{resListarPontos}</pre>}
      </div>

      {/* Buscar ponto por ID */}
      <div className="section">
        <h3>Buscar Ponto por ID</h3>
        <input value={idBuscarPonto} onChange={(e) => setIdBuscarPonto(e.target.value)} placeholder="ID" />
        <button onClick={buscarPontoPorId}>Buscar</button>
        {resBuscarPonto && <pre>{resBuscarPonto}</pre>}
      </div>

      {/* Editar ponto */}
      <div className="section">
        <h3>Editar Ponto</h3>
        <input name="id" placeholder="ID" value={formEditar.id} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="nome" placeholder="Nome" value={formEditar.nome} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="logradouro" placeholder="Logradouro" value={formEditar.logradouro} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="numero" placeholder="Número" value={formEditar.numero} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="bairro" placeholder="Bairro" value={formEditar.bairro} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="cidade" placeholder="Cidade" value={formEditar.cidade} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="cep" placeholder="CEP" value={formEditar.cep} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <select name="estado" value={formEditar.estado} onChange={(e) => handleFormChange(e, setFormEditar)}>
          <EstadosOptions />
        </select>
        <input name="latitude" placeholder="Latitude" value={formEditar.latitude} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="longitude" placeholder="Longitude" value={formEditar.longitude} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <button onClick={editarPonto}>Editar</button>
        {resEditarPonto && <pre>{resEditarPonto}</pre>}
      </div>

      {/* Excluir ponto */}
      <div className="section">
        <h3>Excluir Ponto</h3>
        <input value={idExcluirPonto} onChange={(e) => setIdExcluirPonto(e.target.value)} placeholder="ID" />
        <button onClick={excluirPonto}>Excluir</button>
        {resExcluirPonto && <pre>{resExcluirPonto}</pre>}
      </div>
    </>
  );
}

export default Pontos;