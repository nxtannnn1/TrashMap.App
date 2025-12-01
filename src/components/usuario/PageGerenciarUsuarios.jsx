import React, { useState, useEffect } from "react";
import ScreenLayout from "../ScreenLayout/ScreenLayout"; // Importação do Layout
import API_BASE_URL from "../../config/api";
import "./PageGerenciarUsuarios.css";

const BASE_USUARIOS = `${API_BASE_URL}/usuarios`;

function PageGerenciarUsuarios() {
  // --- STATES ---
  const [listaUsuarios, setListaUsuarios] = useState([]); // Array para a tabela
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" }); // Para mensagens de erro/sucesso

  // Estado único para o formulário (serve para Criar e Editar)
  const [form, setForm] = useState({
    id: "",
    nome: "",
    email: "",
    senha: "",
    tipoUsuario: "ADMIN", // Valor padrão
  });

  const [termoBusca, setTermoBusca] = useState("");

  // --- EFEITO DE CARREGAMENTO (Ao abrir a tela) ---
  useEffect(() => {
    listarUsuarios();
  }, []);

  // --- FUNÇÕES DE API ---

  async function listarUsuarios() {
    setLoading(true);
    try {
      const res = await fetch(BASE_USUARIOS);
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      // Garante que seja um array, mesmo que a API retorne algo diferente
      setListaUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: "error", msg: `Erro ao listar: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function salvarUsuario() {
    // Validação simples
    if (!form.nome || !form.email) {
      setFeedback({ type: "error", msg: "Nome e Email são obrigatórios." });
      return;
    }

    setLoading(true);
    try {
      const isEdicao = !!form.id;
      const url = isEdicao ? `${BASE_USUARIOS}/${form.id}` : BASE_USUARIOS;
      const method = isEdicao ? "PUT" : "POST";

      const bodyData = { ...form };
      // Se for edição e senha estiver vazia, remove para não sobrescrever
      if (isEdicao && !bodyData.senha) delete bodyData.senha;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      setFeedback({
        type: "success",
        msg: isEdicao
          ? "Usuário atualizado com sucesso!"
          : "Usuário cadastrado com sucesso!",
      });

      limparFormulario();
      listarUsuarios(); // Atualiza a tabela
    } catch (err) {
      setFeedback({ type: "error", msg: `Erro ao salvar: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function excluirUsuario(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_USUARIOS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      setFeedback({ type: "success", msg: "Usuário excluído." });
      listarUsuarios();
    } catch (err) {
      setFeedback({ type: "error", msg: `Erro ao excluir: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const carregarEdicao = (usuario) => {
    setForm({
      id: usuario.id || usuario._id, // Ajuste conforme seu backend retorna o ID
      nome: usuario.nome,
      email: usuario.email,
      senha: "", // Senha limpa para edição
      tipoUsuario: usuario.tipoUsuario || "COMUM",
    });
    setFeedback({ type: "info", msg: `Editando usuário: ${usuario.nome}` });
  };

  const limparFormulario = () => {
    setForm({ id: "", nome: "", email: "", senha: "", tipoUsuario: "ADMIN" });
    setFeedback({ type: "", msg: "" });
  };

  // Filtro de busca local
  const usuariosFiltrados = listaUsuarios.filter(
    (u) =>
      u.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.email?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // --- CONTEÚDO DIREITA (TABELA + LOGS) ---
  const RightSideContent = (
    <div className="right-panel-split">
      {/* Parte Superior: Tabela */}
      <div className="top-section-table">
        <div className="header-box">
          <h2>Usuários do Sistema ({usuariosFiltrados.length})</h2>
          <button
            className="btn-refresh"
            onClick={listarUsuarios}
            title="Atualizar Lista"
          >
            ↻
          </button>
        </div>
        <div className="table-wrapper-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Carregando...
                  </td>
                </tr>
              )}
              {!loading && usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
              {usuariosFiltrados.map((user, index) => (
                <tr key={user.id || user._id || index}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge-tipo ${
                        user.tipoUsuario === "ADMIN"
                          ? "badge-admin"
                          : "badge-comum"
                      }`}
                    >
                      {user.tipoUsuario}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon-edit"
                      onClick={() => carregarEdicao(user)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon-delete"
                      onClick={() => excluirUsuario(user.id || user._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parte Inferior: Painel de Feedback/Logs (Substituindo o Mapa) */}
      <div className="bottom-section-logs">
        <h3>Painel de Status</h3>
        <div className="log-container">
          {feedback.msg ? (
            <div className={`feedback-message ${feedback.type}`}>
              {feedback.type === "error" && "❌ "}
              {feedback.type === "success" && "✅ "}
              {feedback.type === "info" && "ℹ️ "}
              {feedback.msg}
            </div>
          ) : (
            <p className="placeholder-text">Nenhuma ação recente registrada.</p>
          )}

          <div className="info-card">
            <p>
              <strong>Total de Admins:</strong>{" "}
              {listaUsuarios.filter((u) => u.tipoUsuario === "ADMIN").length}
            </p>
            <p>
              <strong>Total de Comuns:</strong>{" "}
              {listaUsuarios.filter((u) => u.tipoUsuario !== "ADMIN").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout
      title="Gerenciamento de Usuários"
      rightContent={RightSideContent}
    >
      {/* --- LADO ESQUERDO: FORMULÁRIO --- */}

      {/* 1. Barra de Busca */}
      <div className="barra-busca-clean">
        <input
          type="text"
          className="input-busca-clean"
          placeholder="Buscar Nome ou Email..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button className="botao-busca-clean">
          <span className="icone-lupa-clean">🔍</span>
        </button>
      </div>

      {/* 2. Formulário Principal */}
      <div className="card-edit-form">
        <h3>{form.id ? "Editar Usuário" : "Novo Usuário"}</h3>

        <label>Nome Completo</label>
        <input
          name="nome"
          type="text"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: João Silva"
        />

        <label>E-mail de Acesso</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Ex: joao@trashmap.com"
        />

        <label>
          Senha{" "}
          {form.id && (
            <span style={{ fontSize: "0.7em", fontWeight: "normal" }}>
              (Deixe em branco para manter a atual)
            </span>
          )}
        </label>
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="******"
        />

        <label>Tipo de Permissão</label>
        <select
          name="tipoUsuario"
          value={form.tipoUsuario}
          onChange={handleChange}
          className="select-custom"
        >
          <option value="ADMIN">ADMIN (Acesso Total)</option>
          <option value="COMUM">COMUM (Acesso Limitado)</option>
        </select>

        <div className="button-group">
          <button
            className="btn-action btn-save"
            onClick={salvarUsuario}
            disabled={loading}
          >
            {loading ? "Salvando..." : form.id ? "Atualizar" : "Cadastrar"}
          </button>

          <button
            className="btn-action btn-clear"
            onClick={limparFormulario}
            disabled={loading}
          >
            Limpar / Novo
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
}

export default PageGerenciarUsuarios;
