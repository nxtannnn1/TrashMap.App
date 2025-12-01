import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import { API_BASE_URL } from "../../../config/api";
import "./PageGerenCaminhao.css";

function PageGerenCaminhao() {
  // --- STATES ---
  const [listaCaminhoes, setListaCaminhoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // State do formulário de EDIÇÃO
  const [formEditar, setFormEditar] = useState({
    id: "",
    placa: "",
    modelo: "", // Adicionado para compatibilidade visual
    latitude: "",
    longitude: "",
    statusCaminhao: "ATIVO",
  });

  // --- EFEITOS ---
  useEffect(() => {
    listarCaminhoes();
  }, []);

  // --- API FUNCTIONS ---

  async function listarCaminhoes() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes`);
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setListaCaminhoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao listar:", error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarEdicao() {
    if (!formEditar.id)
      return alert("Selecione um caminhão na tabela para editar.");

    try {
      const payload = {
        placa: formEditar.placa,
        modelo: formEditar.modelo,
        coordenadas: {
          latitude: parseFloat(formEditar.latitude || 0),
          longitude: parseFloat(formEditar.longitude || 0),
        },
        statusCaminhao: formEditar.statusCaminhao,
      };

      const res = await fetch(`${API_BASE_URL}/caminhoes/${formEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro: ${res.status}`);

      alert("Caminhão atualizado com sucesso!");
      listarCaminhoes(); // Atualiza tabela
      limparForm();
    } catch (error) {
      alert(`Erro ao editar: ${error.message}`);
    }
  }

  async function excluirCaminhao() {
    if (!formEditar.id) return alert("Selecione um caminhão para excluir.");
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o caminhão ${formEditar.placa}?`
      )
    )
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes/${formEditar.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Erro: ${res.status}`);

      alert("Excluído com sucesso");
      listarCaminhoes();
      limparForm();
    } catch (error) {
      alert(`Erro ao excluir: ${error.message}`);
    }
  }

  // --- HELPERS ---

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEditar((prev) => ({ ...prev, [name]: value }));
  };

  const selecionarCaminhao = (caminhao) => {
    // Preenche o formulário com os dados do caminhão clicado
    setFormEditar({
      id: caminhao.id || caminhao._id,
      placa: caminhao.placa,
      modelo: caminhao.modelo || "", // Se a API antiga não tiver modelo, fica vazio
      latitude: caminhao.coordenadas?.latitude || caminhao.latitude || "",
      longitude: caminhao.coordenadas?.longitude || caminhao.longitude || "",
      statusCaminhao: caminhao.statusCaminhao || "ATIVO",
    });
  };

  const limparForm = () => {
    setFormEditar({
      id: "",
      placa: "",
      modelo: "",
      latitude: "",
      longitude: "",
      statusCaminhao: "ATIVO",
    });
  };

  // Filtro local
  const caminhoesFiltrados = listaCaminhoes.filter(
    (c) =>
      c.placa?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.modelo?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (c.id && c.id.toString().includes(termoBusca))
  );

  // --- RENDER ---

  const RightSideContent = (
    <div className="right-panel-split">
      {/* Parte Superior: Tabela */}
      <div className="top-section-table">
        <div className="header-box">
          <h2>Frota Cadastrada</h2>
          <button
            className="btn-save"
            style={{ width: "auto", padding: "5px 10px" }}
            onClick={listarCaminhoes}
          >
            ↻
          </button>
        </div>
        <div className="table-wrapper-scroll">
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading &&
                caminhoesFiltrados.map((cam, idx) => (
                  <tr
                    key={idx}
                    onClick={() => selecionarCaminhao(cam)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{cam.placa}</td>
                    <td>{cam.modelo || "-"}</td>
                    <td>
                      <span
                        className={`status ${
                          cam.statusCaminhao === "ATIVO"
                            ? "disponivel"
                            : "manutencao"
                        }`}
                      >
                        {cam.statusCaminhao}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{ border: "none", background: "transparent" }}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parte Inferior: Mapa (Placeholder usando Lat/Long do form) */}
      <div className="bottom-section-map">
        <h3>Localização em Tempo Real</h3>
        {formEditar.latitude && formEditar.longitude ? (
          <p>
            📍 Exibindo no mapa: <br />
            Lat: {formEditar.latitude} <br />
            Long: {formEditar.longitude}
          </p>
        ) : (
          <p style={{ color: "#999" }}>
            Selecione um caminhão para ver a localização
          </p>
        )}
      </div>
    </div>
  );

  return (
    <ScreenLayout
      title="Gerenciamento de Caminhões"
      rightContent={RightSideContent}
    >
      {/* --- LADO ESQUERDO --- */}

      {/* 1. Barra de Busca */}
      <div className="barra-busca-clean">
        <input
          type="text"
          className="input-busca-clean"
          placeholder="Pesquise Placa ou ID"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button className="botao-busca-clean">
          <span className="icone-lupa-clean">🔍</span>
        </button>
      </div>

      {/* 2. Formulário de Edição */}
      <div className="card-edit-form">
        <h3>
          {formEditar.id
            ? `Editando: ${formEditar.placa}`
            : "Selecione na Tabela"}
        </h3>

        <label>Placa</label>
        <input
          name="placa"
          value={formEditar.placa}
          onChange={handleFormChange}
          placeholder="ABC-1234"
        />

        <label>Modelo</label>
        <input
          name="modelo"
          value={formEditar.modelo}
          onChange={handleFormChange}
          placeholder="Ex: Scania R450"
        />

        <label>Latitude</label>
        <input
          name="latitude"
          value={formEditar.latitude}
          onChange={handleFormChange}
          placeholder="-23.5505"
        />

        <label>Longitude</label>
        <input
          name="longitude"
          value={formEditar.longitude}
          onChange={handleFormChange}
          placeholder="-46.6333"
        />

        <label>Status</label>
        <select
          name="statusCaminhao"
          value={formEditar.statusCaminhao}
          onChange={handleFormChange}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="ATIVO">ATIVO</option>
          <option value="INATIVO">INATIVO</option>
          <option value="EM_MANUTENCAO">EM MANUTENÇÃO</option>
        </select>

        <div className="button-group">
          <button className="btn-action btn-save" onClick={salvarEdicao}>
            Salvar
          </button>
          <button className="btn-action btn-delete" onClick={excluirCaminhao}>
            Deletar
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
}

export default PageGerenCaminhao;
