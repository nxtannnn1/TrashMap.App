// import React, { useState } from 'react';
// import API_BASE_URL from '../config/api';

// // A URL base da sua API
// const baseURL = `${API_BASE_URL}/caminhoes`;

// function Caminhoes() {
//   // ==========================================================
//   // 1. STATES para controlar os formulários
//   // ==========================================================

//   // State para o formulário de "Cadastrar"
//   const [formCadastro, setFormCadastro] = useState({
//     placa: '',
//     latitude: '',
//     longitude: '',
//     statusCaminhao: 'ATIVO',
//   });
//   // State para o formulário de "Editar"
//   const [formEditar, setFormEditar] = useState({
//     id: '',
//     placa: '',
//     latitude: '',
//     longitude: '',
  
//     statusCaminhao: 'ATIVO',
//   });
//   // State para os outros campos de ID e JSON
//   const [jsonLote, setJsonLote] = useState('');
//   const [idBuscar, setIdBuscar] = useState('');
//   const [idExcluir, setIdExcluir] = useState('');
//   const [idStatus, setIdStatus] = useState('');
//   const [novoStatus, setNovoStatus] = useState('ATIVO');
//   const [idLocal, setIdLocal] = useState('');
//   const [latLocal, setLatLocal] = useState('');
//   const [longLocal, setLongLocal] = useState('');

//   // ==========================================================
//   // 2. STATES para guardar as respostas (o conteúdo dos <pre>)
//   // ==========================================================
//   const [resCadastrar, setResCadastrar] = useState('');
//   const [resLote, setResLote] = useState('');
//   const [resListar, setResListar] = useState('');
//   const [resBuscar, setResBuscar] = useState('');
//   const [resEditar, setResEditar] = useState('');
//   const [resExcluir, setResExcluir] = useState('');
//   const [resStatus, setResStatus] = useState('');
//   const [resLocal, setResLocal] = useState('');

//   // ==========================================================
//   // 3. Funções "Handler" para atualizar os states dos inputs
//   // ==========================================================
  
//   // Handlers genéricos para os formulários de cadastro e edição
//   const handleFormChange = (e, setForm) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   // Funções de "fetch" (adaptadas do seu caminhao.js)
  
//   // Cadastrar Caminhão
//   async function cadastrarCaminhao() {
//     try {
//       const data = {
//         placa: formCadastro.placa,
//         coordenadas: {
//           latitude: parseFloat(formCadastro.latitude),
//           longitude: parseFloat(formCadastro.longitude)
//         },
//         statusCaminhao: formCadastro.statusCaminhao,
//       };
//       const res = await fetch(baseURL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResCadastrar(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResCadastrar(`Erro: ${error.message}`);
//     }
//   }

//   // Cadastrar Lote
//   async function cadastrarLote() {
//     try {
//       const data = JSON.parse(jsonLote);
//       data.forEach(c => {
//         if (!c.coordenadas) {
//           c.coordenadas = { latitude: c.latitude, longitude: c.longitude };
//         }
//       });
//       const res = await fetch(`${baseURL}/lote`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResLote(JSON.stringify(await res.json(), null, 2));
//     } catch (e) {
//       setResLote(`Erro: ${e.message}`);
//     }
//   }

//   // Listar Todos
//   async function listarCaminhoes() {
//     try {
//       const res = await fetch(baseURL);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResListar(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResListar(`Erro: ${error.message}`);
//     }
//   }

//   // Buscar por ID
//   async function buscarPorId() {
//     try {
//       const res = await fetch(`${baseURL}/${idBuscar}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResBuscar(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResBuscar(`Erro: ${error.message}`);
//     }
//   }

//   // Editar Caminhão
//   async function editarCaminhao() {
//     try {
//       const data = {
//         placa: formEditar.placa,
//         coordenadas: {
//           latitude: parseFloat(formEditar.latitude),
//           longitude: parseFloat(formEditar.longitude)
//         },
//         statusCaminhao: formEditar.statusCaminhao,
      
//       };
//       const res = await fetch(`${baseURL}/${formEditar.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResEditar(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResEditar(`Erro: ${error.message}`);
//     }
//   }

//   // Excluir Caminhão
//   async function excluirCaminhao() {
//     try {
//       const res = await fetch(`${baseURL}/${idExcluir}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResExcluir(res.ok ? "Excluído com sucesso" : "Erro ao excluir");
//     } catch (error) {
//       setResExcluir(`Erro: ${error.message}`);
//     }
//   }

//   // Atualizar Status
//   async function atualizarStatus() {
//     try {
//       const res = await fetch(`${baseURL}/${idStatus}/status?statusCaminhao=${novoStatus}`, { method: 'PATCH' });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResStatus(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResStatus(`Erro: ${error.message}`);
//     }
//   }

//   // Atualizar Localização
//   async function atualizarLocalizacao() {
//     try {
//       const data = {
//         latitude: parseFloat(latLocal),
//         longitude: parseFloat(longLocal)
//       };
//       const res = await fetch(`${baseURL}/${idLocal}/localizacao`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       setResLocal(JSON.stringify(await res.json(), null, 2));
//     } catch (error) {
//       setResLocal(`Erro: ${error.message}`);
//     }
//   }

//   // ==========================================================
//   // 4. O JSX (HTML convertido)
//   // ==========================================================
//   return (
//     <>
//       <h2>Caminhões</h2>

//       {/* Cadastrar Caminhão */}
//       <div className="section">
//         <h3>Cadastrar Caminhão</h3>
//         <input name="placa" placeholder="Placa" value={formCadastro.placa} onChange={(e) => handleFormChange(e, setFormCadastro)} />
//         <input name="latitude" placeholder="Latitude" value={formCadastro.latitude} onChange={(e) => handleFormChange(e, setFormCadastro)} />
//         <input name="longitude" placeholder="Longitude" value={formCadastro.longitude} onChange={(e) => handleFormChange(e, setFormCadastro)} />
//         <select name="statusCaminhao" value={formCadastro.statusCaminhao} onChange={(e) => handleFormChange(e, setFormCadastro)}>
//           <option value="ATIVO">ATIVO</option>
//           <option value="INATIVO">INATIVO</option>
//           <option value="EM_MANUTENCAO">EM_MANUTENCAO</option>
//         </select>
//         <button onClick={cadastrarCaminhao}>Cadastrar</button>
//         {resCadastrar && <pre>{resCadastrar}</pre>}
//       </div>


//       {/* Listar Caminhões */}
//       <div className="section">
//         <h3>Listar Caminhões</h3>
//         <button onClick={listarCaminhoes}>Listar Todos</button>
//         {resListar && <pre>{resListar}</pre>}
//       </div>

//       {/* Buscar por ID */}
//       <div className="section">
//         <h3>Buscar Caminhão por ID</h3>
//         <input value={idBuscar} onChange={(e) => setIdBuscar(e.target.value)} placeholder="ID" />
//         <button onClick={buscarPorId}>Buscar</button>
//         {resBuscar && <pre>{resBuscar}</pre>}
//       </div>

//       {/* Editar Caminhão */}
//       <div className="section">
//         <h3>Editar Caminhão</h3>
//         <input name="id" placeholder="ID" value={formEditar.id} onChange={(e) => handleFormChange(e, setFormEditar)} />
//         <input name="placa" placeholder="Placa" value={formEditar.placa} onChange={(e) => handleFormChange(e, setFormEditar)} />
//         <input name="latitude" placeholder="Latitude" value={formEditar.latitude} onChange={(e) => handleFormChange(e, setFormEditar)} />
//         <input name="longitude" placeholder="Longitude" value={formEditar.longitude} onChange={(e) => handleFormChange(e, setFormEditar)} />
//         <select name="statusCaminhao" value={formEditar.statusCaminhao} onChange={(e) => handleFormChange(e, setFormEditar)}>
//           <option value="ATIVO">ATIVO</option>
//           <option value="INATIVO">INATIVO</option>
//           <option value="EM_MANUTENCAO">EM_MANUTENCAO</option>
//         </select>
//         <button onClick={editarCaminhao}>Editar</button>
//         {resEditar && <pre>{resEditar}</pre>}
//       </div>

//       {/* Excluir Caminhão */}
//       <div className="section">
//         <h3>Excluir Caminhão</h3>
//         <input value={idExcluir} onChange={(e) => setIdExcluir(e.target.value)} placeholder="ID" />
//         <button onClick={excluirCaminhao}>Excluir</button>
//         {resExcluir && <pre>{resExcluir}</pre>}
//       </div>

//       {/* Atualizar Status */}
//       <div className="section">
//         <h3>Atualizar Status</h3>
//         <input value={idStatus} onChange={(e) => setIdStatus(e.target.value)} placeholder="ID" />
//         <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
//           <option value="ATIVO">ATIVO</option>
//           <option value="INATIVO">INATIVO</option>
//           <option value="EM_MANUTENCAO">EM_MANUTENCAO</option>
//         </select>
//         <button onClick={atualizarStatus}>Atualizar</button>
//         {resStatus && <pre>{resStatus}</pre>}
//       </div>

//       {/* Atualizar Localização */}
//       <div className="section">
//         <h3>Atualizar Localização</h3>
//         <input value={idLocal} onChange={(e) => setIdLocal(e.target.value)} placeholder="ID" />
//         <input value={latLocal} onChange={(e) => setLatLocal(e.target.value)} placeholder="Latitude" />
//         <input value={longLocal} onChange={(e) => setLongLocal(e.target.value)} placeholder="Longitude" />
//         <button onClick={atualizarLocalizacao}>Atualizar</button>
//         {resLocal && <pre>{resLocal}</pre>}
//       </div>
//     </>
//   );
// }

// export default Caminhoes;