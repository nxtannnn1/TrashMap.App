// src/pages/Pontos.jsx
import React, { useState } from 'react';
import { useApiIsLoaded } from '@vis.gl/react-google-maps';
import MapaADM from '../components/MapaADM'; 
import API_BASE_URL from '../config/api';

const BASE_PONTOS = `${API_BASE_URL}/pontos-de-coleta`;

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

// ==========================================================
// FUNÇÃO AUXILIAR: Extrai campos do endereço (Geocoding Reversa)
// ==========================================================
// O objeto de resultado da Geocoding API é complexo, esta função simplifica.
const parseAddressComponents = (components) => {
    let logradouro = '';
    let numero = '';
    let bairro = '';
    let cidade = '';
    let estado = '';
    let cep = '';

    for (const component of components) {
        // Rota
        if (component.types.includes('route')) {
            logradouro = component.long_name;
        // Número da rua
        } else if (component.types.includes('street_number')) {
            numero = component.long_name;
        // Bairro
        } else if (component.types.includes('sublocality_level_1') || component.types.includes('sublocality')) {
            bairro = component.long_name;
        // Cidade/Município
        } else if (component.types.includes('locality')) {
            cidade = component.long_name;
        // Estado (UF)
        } else if (component.types.includes('administrative_area_level_1')) {
            estado = component.short_name;
        // CEP
        } else if (component.types.includes('postal_code')) {
            cep = component.long_name;
        }
    }
    
    return { logradouro, numero, bairro, cidade, estado, cep };
};


function Pontos() {
  // Hook para saber se a API do Google Maps carregou
  const isApiLoaded = useApiIsLoaded();

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
    
    // ... (Os estados formEditar, jsonLotePontos, filtroEstado, etc. são mantidos)
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
  // 2. STATES para guardar as respostas
  // ==========================================================
  const [resCadastrarPonto, setResCadastrarPonto] = useState('');
  const [resCadastrarLote, setResCadastrarLote] = useState('');
  const [resListarPontos, setResListarPontos] = useState('');
  const [resBuscarPonto, setResBuscarPonto] = useState('');
  const [resEditarPonto, setResEditarPonto] = useState('');
  const [resExcluirPonto, setResExcluirPonto] = useState('');
  
  const [pontosNoMapa, setPontosNoMapa] = useState([]); 

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
  // 4. GEOCODING FORWARD (Endereço -> Coordenadas)
  // ==========================================================
  async function geocodificarEndereco(e) {
    e.preventDefault();
    
    const form = formCadastro;
    
    if (!isApiLoaded) {
      alert('Aguarde: A API do Google Maps ainda não foi carregada.');
      return;
    }

    // Monta o endereço completo
    const fullAddress = `${form.logradouro}, ${form.numero}, ${form.bairro}, ${form.cidade}, ${form.estado}, Brasil, CEP ${form.cep}`;

    const geocoder = new window.google.maps.Geocoder();

    try {
      const { results, status } = await geocoder.geocode({ address: fullAddress });

      if (status === 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        
        setFormCadastro(prev => ({ 
          ...prev, 
          latitude: lat.toString(), 
          longitude: lng.toString() 
        }));

        alert(`Coordenadas obtidas: Lat ${lat}, Lng ${lng}.`);
      } else {
        alert('Geocodificação Falhou. Status: ' + status);
      }
    } catch (err) {
      alert('Erro na comunicação com a API de Geocoding: ' + err.message);
    }
  }


  // ==========================================================
  // 4B. GEOCODING REVERSO (Coordenadas -> Endereço) - NOVIDADE!
  // ==========================================================
  // Recebe as coordenadas do MapaADM quando o usuário clica.
 async function geocodificarReverso(latLng) {
  if (!isApiLoaded) {
    alert('Aguarde: A API do Google Maps ainda não foi carregada.');
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  const lat = latLng.lat.toString();
  const lng = latLng.lng.toString();

  try {
    // Encapsula o callback em uma Promise
    const { results, status } = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat: latLng.lat, lng: latLng.lng } }, (results, status) => {
        if (status === 'OK') resolve({ results, status });
        else reject({ results, status });
      });
    });

    if (results[0]) {
      const addressComponents = results[0].address_components;
      const parsedAddress = parseAddressComponents(addressComponents);

      setFormCadastro(prev => ({ 
        ...prev, 
        ...parsedAddress,
        latitude: lat,
        longitude: lng 
      }));

      alert(`Endereço obtido por clique no mapa: ${results[0].formatted_address}.`);
    }
  } catch (err) {
    alert('Geocodificação Reversa falhou. Status: ' + (err.status || 'erro desconhecido'));
    console.error(err);
  }
}


  // ==========================================================
  // 5. Funções de "fetch" (Mantidas as originais)
  // ==========================================================

  async function cadastrarPonto() {
    if (!formCadastro.latitude || !formCadastro.longitude) {
      setResCadastrarPonto("Erro: Preencha ou geocodifique as coordenadas antes de cadastrar.");
      return;
    }
    
    try {
      const data = buildPontoData(formCadastro);
      const res = await fetch(BASE_PONTOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const newPonto = await res.json();
      setResCadastrarPonto(JSON.stringify(newPonto, null, 2));
      setPontosNoMapa(prev => [...prev, newPonto]);
      
    } catch (err) {
      setResCadastrarPonto(`Erro: ${err.message}`);
    }
  }

  // ... (O restante das funções fetch: cadastrarLotePontos, listarPontos, buscarPontoPorId, editarPonto, excluirPonto) ...

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

  async function listarPontos() {
    try {
      const url = filtroEstado ? `${BASE_PONTOS}?estado=${filtroEstado}` : BASE_PONTOS;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setPontosNoMapa(data);
      setResListarPontos(JSON.stringify(data, null, 2));
      
    } catch (err) {
      setResListarPontos(`Erro: ${err.message}`);
      setPontosNoMapa([]);
    }
  }

  async function buscarPontoPorId() {
    try {
      const res = await fetch(`${BASE_PONTOS}/${idBuscarPonto}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResBuscarPonto(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResBuscarPonto(`Erro: ${err.message}`);
    }
  }

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
  // 6. O JSX (HTML convertido)
  // ==========================================================
  return (
    <>
      <h2>Pontos de Coleta</h2>

      {/* 🏞️ SEÇÃO MAPA */}
      <div className="section">
        <h3>Visualização no Mapa</h3>
        {/* NOVIDADE: Passando a função de callback para o MapaADM */}
        <MapaADM pontos={pontosNoMapa} onMapClick={geocodificarReverso} /> 
      </div>
      {/* ------------------------------------------------------------------- */}

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
        
        {/* BOTÃO DE GEOCODIFICAÇÃO (Endereço -> Coordenadas) */}
        <button 
            onClick={geocodificarEndereco} 
            disabled={!isApiLoaded}
            style={{ backgroundColor: isApiLoaded ? '#007bff' : '#cccccc' }}
        >
            {isApiLoaded ? 'Auto-Preencher Lat/Lng' : 'Carregando API...'}
        </button>

        {/* Campos de Coordenadas (Leitura apenas, para evitar conflito com o clique) */}
        <input name="latitude" placeholder="Latitude (Preenchida via Geocoding)" value={formCadastro.latitude} onChange={(e) => handleFormChange(e, setFormCadastro)} readOnly />
        <input name="longitude" placeholder="Longitude (Preenchida via Geocoding)" value={formCadastro.longitude} onChange={(e) => handleFormChange(e, setFormCadastro)} readOnly />

        <button onClick={cadastrarPonto}>Cadastrar Ponto na API</button>
        {resCadastrarPonto && <pre>{resCadastrarPonto}</pre>}
      </div>

      {/* ... (O restante do seu JSX é mantido) ... */}
      
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

      {/* Listar Pontos (Para carregar no mapa e JSON) */}
      <div className="section">
        <h3>Listar Pontos (Carregar no Mapa)</h3>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos</option>
          <EstadosOptions />
        </select>
        <button onClick={listarPontos}>Carregar Pontos</button>
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