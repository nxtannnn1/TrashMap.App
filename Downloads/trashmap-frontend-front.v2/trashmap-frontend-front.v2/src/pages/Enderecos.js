// src/pages/Enderecos.jsx
import React, { useState } from 'react';
import API_BASE_URL from '../config/api';

const BASE_ENDERECOS = `'${API_BASE_URL}/enderecos`;

// Helper para evitar repetição de <option>
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

const EstadosOptions = ({ includeAllOption = false }) => (
  <>
    {includeAllOption && <option value="">Todos</option>}
    {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
  </>
);

function Enderecos() {
  // ==========================================================
  // 1. STATES para controlar os formulários
  // ==========================================================
  const [formCadastro, setFormCadastro] = useState({
    logradouro: '', numero: '', bairro: '', cidade: '', cep: '', estado: 'AC', latitude: '', longitude: ''
  });

  const [formEditar, setFormEditar] = useState({
    id: '', logradouro: '', numero: '', bairro: '', cidade: '', cep: '', estado: 'AC', latitude: '', longitude: ''
  });

  const [formProximos, setFormProximos] = useState({
    latitude: '', longitude: '', raio: '', cidade: '', estado: ''
  });

  const [jsonLoteEnderecos, setJsonLoteEnderecos] = useState('');
  const [idBuscarEndereco, setIdBuscarEndereco] = useState('');
  const [idExcluirEndereco, setIdExcluirEndereco] = useState('');

  // ==========================================================
  // 2. STATES para guardar as respostas (o conteúdo dos <pre>)
  // ==========================================================
  const [resCadastrarEndereco, setResCadastrarEndereco] = useState('');
  const [resCadastrarLoteEndereco, setResCadastrarLoteEndereco] = useState('');
  const [resListarEnderecos, setResListarEnderecos] = useState('');
  const [resBuscarEndereco, setResBuscarEndereco] = useState('');
  const [resEditarEndereco, setResEditarEndereco] = useState('');
  const [resExcluirEndereco, setResExcluirEndereco] = useState('');
  const [resProximosEnderecos, setResProximosEnderecos] = useState('');

  // ==========================================================
  // 3. Handlers para atualizar os states
  // ==========================================================
  const handleFormChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper para montar o corpo (body) da requisição
  const buildEnderecoData = (formData) => {
    return {
      logradouro: formData.logradouro,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      cep: formData.cep,
      estado: formData.estado,
      coordenadas: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      }
    };
  };

  // ==========================================================
  // 4. Funções de "fetch" (adaptadas do seu enderecos.js)
  // ==========================================================

  // Cadastrar endereço único
  async function cadastrarEndereco() {
    try {
      const data = buildEnderecoData(formCadastro);
      const res = await fetch(BASE_ENDERECOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResCadastrarEndereco(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResCadastrarEndereco(`Erro: ${err.message}`);
    }
  }

  // Cadastrar lote
  async function cadastrarLoteEnderecos() {
    let data;
    try {
      data = JSON.parse(jsonLoteEnderecos);
    } catch(e) {
      setResCadastrarLoteEndereco("JSON inválido");
      return;
    }
    try {
      const res = await fetch(`${BASE_ENDERECOS}/lote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResCadastrarLoteEndereco(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResCadastrarLoteEndereco(`Erro: ${err.message}`);
    }
  }

  // Listar todos endereços
  async function listarEnderecos() {
    try {
      const res = await fetch(BASE_ENDERECOS);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResListarEnderecos(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResListarEnderecos(`Erro: ${err.message}`);
    }
  }

  // Buscar por ID
  async function buscarEnderecoPorId() {
    try {
      const res = await fetch(`${BASE_ENDERECOS}/${idBuscarEndereco}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResBuscarEndereco(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResBuscarEndereco(`Erro: ${err.message}`);
    }
  }

  // Editar endereço
  async function editarEndereco() {
    try {
      const data = buildEnderecoData(formEditar);
      const res = await fetch(`${BASE_ENDERECOS}/${formEditar.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResEditarEndereco(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResEditarEndereco(`Erro: ${err.message}`);
    }
  }

  // Excluir endereço
  async function excluirEndereco() {
    try {
      const res = await fetch(`${BASE_ENDERECOS}/${idExcluirEndereco}`, {method: "DELETE"});
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResExcluirEndereco("Excluído com sucesso!");
    } catch (err) {
      setResExcluirEndereco(`Erro: ${err.message}`);
    }
  }

  // Listar próximos endereços
  async function listarProximosEnderecos() {
    try {
      // Usamos URLSearchParams para construir a query string de forma segura
      const params = new URLSearchParams({
        latitude: formProximos.latitude,
        longitude: formProximos.longitude,
        raioKm: formProximos.raio || 5.0 // Valor padrão de 5.0
      });

      if(formProximos.cidade) params.append('cidade', formProximos.cidade);
      if(formProximos.estado) params.append('estado', formProximos.estado);

      const url = `${BASE_ENDERECOS}/proximos?${params.toString()}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResProximosEnderecos(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResProximosEnderecos(`Erro: ${err.message}`);
    }
  }

  // ==========================================================
  // 5. O JSX (HTML convertido)
  // ==========================================================
  return (
    <>
      <h2>Endereços</h2>

      {/* Cadastrar Endereço */}
      <div className="section">
        <h3>Cadastrar Endereço</h3>
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
        <button onClick={cadastrarEndereco}>Cadastrar</button>
        {resCadastrarEndereco && <pre>{resCadastrarEndereco}</pre>}
      </div>

      {/* Cadastrar Lote de Endereços */}
      <div className="section">
        <h3>Cadastrar Lote (JSON Array)</h3>
        <textarea 
          value={jsonLoteEnderecos} 
          onChange={(e) => setJsonLoteEnderecos(e.target.value)}
          placeholder='[{"logradouro":"Rua X",...}]'
        ></textarea>
        <button onClick={cadastrarLoteEnderecos}>Cadastrar Lote</button>
        {resCadastrarLoteEndereco && <pre>{resCadastrarLoteEndereco}</pre>}
      </div>

      {/* Listar Endereços */}
      <div className="section">
        <h3>Listar Endereços</h3>
        <button onClick={listarEnderecos}>Listar Todos</button>
        {resListarEnderecos && <pre>{resListarEnderecos}</pre>}
      </div>

      {/* Buscar por ID */}
      <div className="section">
        <h3>Buscar Endereço por ID</h3>
        <input value={idBuscarEndereco} onChange={(e) => setIdBuscarEndereco(e.target.value)} placeholder="ID" />
        <button onClick={buscarEnderecoPorId}>Buscar</button>
        {resBuscarEndereco && <pre>{resBuscarEndereco}</pre>}
      </div>

      {/* Editar Endereço */}
      <div className="section">
        <h3>Editar Endereço</h3>
        <input name="id" placeholder="ID" value={formEditar.id} onChange={(e) => handleFormChange(e, setFormEditar)} />
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
        <button onClick={editarEndereco}>Editar</button>
        {resEditarEndereco && <pre>{resEditarEndereco}</pre>}
      </div>

      {/* Excluir Endereço */}
      <div className="section">
        <h3>Excluir Endereço</h3>
        <input value={idExcluirEndereco} onChange={(e) => setIdExcluirEndereco(e.target.value)} placeholder="ID" />
        <button onClick={excluirEndereco}>Excluir</button>
        {resExcluirEndereco && <pre>{resExcluirEndereco}</pre>}
      </div>

      {/* Listar Próximos Endereços */}
      <div className="section">
        <h3>Endereços Próximos</h3>
        <input name="latitude" placeholder="Latitude" value={formProximos.latitude} onChange={(e) => handleFormChange(e, setFormProximos)} />
        <input name="longitude" placeholder="Longitude" value={formProximos.longitude} onChange={(e) => handleFormChange(e, setFormProximos)} />
        <input name="raio" placeholder="Raio km (opcional)" value={formProximos.raio} onChange={(e) => handleFormChange(e, setFormProximos)} />
        <input name="cidade" placeholder="Cidade (opcional)" value={formProximos.cidade} onChange={(e) => handleFormChange(e, setFormProximos)} />
        <select name="estado" value={formProximos.estado} onChange={(e) => handleFormChange(e, setFormProximos)}>
          <EstadosOptions includeAllOption={true} />
        </select>
        <button onClick={listarProximosEnderecos}>Listar Próximos</button>
        {resProximosEnderecos && <pre>{resProximosEnderecos}</pre>}
      </div>
    </>
  );
}

export default Enderecos;