// src/pages/Usuarios.jsx
import React, { useState } from 'react';
import API_BASE_URL from '../config/api';

const BASE_USUARIOS = `${API_BASE_URL}/usuarios`;

function Usuarios() {
  // ==========================================================
  // 1. STATES para controlar os formulários
  // ==========================================================
  const [formCadastro, setFormCadastro] = useState({
    nome: '', email: '', senha: '', tipoUsuario: 'ADMIN'
  });
  
  const [formEditar, setFormEditar] = useState({
    id: '', nome: '', email: '', senha: '', tipoUsuario: 'ADMIN'
  });

  const [idBuscarUsuario, setIdBuscarUsuario] = useState('');
  const [idExcluirUsuario, setIdExcluirUsuario] = useState('');

  // ==========================================================
  // 2. STATES para guardar as respostas (o conteúdo dos <pre>)
  // ==========================================================
  const [resCadastrarUsuario, setResCadastrarUsuario] = useState('');
  const [resListarUsuarios, setResListarUsuarios] = useState('');
  const [resBuscarUsuario, setResBuscarUsuario] = useState('');
  const [resEditarUsuario, setResEditarUsuario] = useState('');
  const [resExcluirUsuario, setResExcluirUsuario] = useState('');

  // ==========================================================
  // 3. Handlers para atualizar os states
  // ==========================================================
  const handleFormChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ==========================================================
  // 4. Funções de "fetch" (adaptadas do seu usuarios.js)
  // ==========================================================

  async function cadastrarUsuario() {
    try {
      // Oculta a senha do body se estiver vazia (caso a API não trate)
      const data = { ...formCadastro };
      if (!data.senha) delete data.senha;

      const res = await fetch(BASE_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResCadastrarUsuario(JSON.stringify(await res.json(), null, 2));
    } catch(err) {
      setResCadastrarUsuario(`Erro: ${err.message}`);
    }
  }

  async function listarUsuarios() {
    try {
      const res = await fetch(BASE_USUARIOS);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResListarUsuarios(JSON.stringify(await res.json(), null, 2));
    } catch(err) {
      setResListarUsuarios(`Erro: ${err.message}`);
    }
  }

  async function buscarUsuarioPorId() {
    try {
      const res = await fetch(`${BASE_USUARIOS}/${idBuscarUsuario}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResBuscarUsuario(JSON.stringify(await res.json(), null, 2));
    } catch(err) {
      setResBuscarUsuario(`Erro: ${err.message}`);
    }
  }

  async function editarUsuario() {
    try {
      const data = {
        nome: formEditar.nome,
        email: formEditar.email,
        senha: formEditar.senha,
        tipoUsuario: formEditar.tipoUsuario
      };
      // Oculta a senha do body se estiver vazia (para não atualizar com "")
      if (!data.senha) delete data.senha;

      const res = await fetch(`${BASE_USUARIOS}/${formEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResEditarUsuario(JSON.stringify(await res.json(), null, 2));
    } catch(err) {
      setResEditarUsuario(`Erro: ${err.message}`);
    }
  }

  async function excluirUsuario() {
    try {
      const res = await fetch(`${BASE_USUARIOS}/${idExcluirUsuario}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setResExcluirUsuario(`Usuário ${idExcluirUsuario} excluído com sucesso.`);
    } catch(err) {
      setResExcluirUsuario(`Erro: ${err.message}`);
    }
  }

  // ==========================================================
  // 5. O JSX (HTML convertido)
  // ==========================================================
  return (
    <>
      {/* O <h2> já estava no HTML, mas fora da div.section, 
          então mantivemos aqui fora também.
      */}
      <h2>Gerenciamento de Usuários</h2>

      <div className="section">
        <h3>Cadastrar Usuário</h3>
        <input name="nome" placeholder="Nome" value={formCadastro.nome} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="email" placeholder="E-mail" value={formCadastro.email} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <input name="senha" type="password" placeholder="Senha" value={formCadastro.senha} onChange={(e) => handleFormChange(e, setFormCadastro)} />
        <select name="tipoUsuario" value={formCadastro.tipoUsuario} onChange={(e) => handleFormChange(e, setFormCadastro)}>
          <option value="ADMIN">ADMIN</option>
          <option value="COMUM">COMUM</option>
        </select>
        <button onClick={cadastrarUsuario}>Cadastrar</button>
        {resCadastrarUsuario && <pre>{resCadastrarUsuario}</pre>}
      </div>

      <div className="section">
        <h3>Listar Usuários</h3>
        <button onClick={listarUsuarios}>Listar Todos</button>
        {resListarUsuarios && <pre>{resListarUsuarios}</pre>}
      </div>

      <div className="section">
        <h3>Buscar Usuário por ID</h3>
        <input value={idBuscarUsuario} onChange={(e) => setIdBuscarUsuario(e.target.value)} placeholder="ID" />
        <button onClick={buscarUsuarioPorId}>Buscar</button>
        {resBuscarUsuario && <pre>{resBuscarUsuario}</pre>}
      </div>

      <div className="section">
        <h3>Editar Usuário</h3>
        <input name="id" placeholder="ID" value={formEditar.id} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="nome" placeholder="Nome" value={formEditar.nome} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="email" placeholder="E-mail" value={formEditar.email} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <input name="senha" type="password" placeholder="Senha (deixe em branco para não alterar)" value={formEditar.senha} onChange={(e) => handleFormChange(e, setFormEditar)} />
        <select name="tipoUsuario" value={formEditar.tipoUsuario} onChange={(e) => handleFormChange(e, setFormEditar)}>
          <option value="ADMIN">ADMIN</option>
          <option value="COMUM">COMUM</option>
        </select>
        <button onClick={editarUsuario}>Editar</button>
        {resEditarUsuario && <pre>{resEditarUsuario}</pre>}
      </div>

      <div className="section">
        <h3>Excluir Usuário</h3>
        <input value={idExcluirUsuario} onChange={(e) => setIdExcluirUsuario(e.target.value)} placeholder="ID" />
        <button onClick={excluirUsuario}>Excluir</button>
        {resExcluirUsuario && <pre>{resExcluirUsuario}</pre>}
      </div>
    </>
  );
}

export default Usuarios;