import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import { API_BASE_URL } from "../../../config/api";
import MapaADM from "../../mapas/MapaADM";
import "./PageGerenCaminhao.css";

function PageGerenCaminhao() {
  const [listaCaminhoes, setListaCaminhoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const [formEditar, setFormEditar] = useState({
    id: "",
    placa: "",
    modelo: "",
    latitude: "",
    longitude: "",
    statusCaminhao: "ATIVO",
  });

  const [mapCoords, setMapCoords] = useState({ lat: "", lng: "" });

  useEffect(() => {
    listarCaminhoes();
  }, []);

  async function listarCaminhoes() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes`);
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setListaCaminhoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao listar:", error);
      setFeedback({ type: "error", msg: "Erro ao carregar caminhões" });
    } finally {
      setLoading(false);
    }
  }

  async function salvarEdicao() {
    if (!formEditar.id) {
      setFeedback({ type: "error", msg: "Selecione um caminhão na tabela para editar." });
      return;
    }

    setLoading(true);
    setFeedback({ type: "", msg: "" });

    try {
      const payload = {
        placa: formEditar.placa,
        modelo: formEditar.modelo,
        coordenadas: {
          latitude: parseFloat(formEditar.latitude || mapCoords.lat || 0),
          longitude: parseFloat(formEditar.longitude || mapCoords.lng || 0),
        },
        statusCaminhao: formEditar.statusCaminhao,
      };

      const res = await fetch(`${API_BASE_URL}/caminhoes/${formEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      setFeedback({ type: "success", msg: "Caminhão atualizado com sucesso!" });
      listarCaminhoes();
      limparForm();
    } catch (error) {
      setFeedback({ type: "error", msg: `Erro ao editar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function excluirCaminhao() {
    if (!formEditar.id) {
      setFeedback({ type: "error", msg: "Selecione um caminhão para excluir." });
      return;
    }

    if (!window.confirm(`Tem certeza que deseja excluir o caminhão ${formEditar.placa}?`)) {
      return;
    }

    setLoading(true);
    setFeedback({ type: "", msg: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes/${formEditar.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      setFeedback({ type: "success", msg: "Caminhão excluído com sucesso!" });
      listarCaminhoes();
      limparForm();
    } catch (error) {
      setFeedback({ type: "error", msg: `Erro ao excluir: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEditar((prev) => ({ ...prev, [name]: value }));
  };

  const selecionarCaminhao = (caminhao) => {
    setFormEditar({
      id: caminhao.id,
      placa: caminhao.placa,
      modelo: caminhao.modelo || "",
      latitude: caminhao.coordenadas?.latitude || "",
      longitude: caminhao.coordenadas?.longitude || "",
      statusCaminhao: caminhao.statusCaminhao || "ATIVO",
    });

    setMapCoords({
      lat: caminhao.coordenadas?.latitude || "",
      lng: caminhao.coordenadas?.longitude || "",
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
    setMapCoords({ lat: "", lng: "" });
    setFeedback({ type: "", msg: "" });
  };

  const handleMapClick = (coords) => {
    if (!formEditar.id) {
      setFeedback({ type: "error", msg: "Selecione um caminhão para editar primeiro." });
      return;
    }

    setFormEditar((prev) => ({
      ...prev,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
    }));
    setMapCoords(coords);

    setFeedback({
      type: "success",
      msg: `Nova localização definida: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
    });
  };

  useEffect(() => {
    if (feedback.msg) {
      const timer = setTimeout(() => {
        setFeedback({ type: "", msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback.msg]);

  // 🔹 Filtro ajustado para seu DTO
  const caminhoesFiltrados = listaCaminhoes.filter(
    (c) =>
      c.placa?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (c.modelo?.toLowerCase().includes(termoBusca.toLowerCase())) ||
      (c.id && c.id.toString().includes(termoBusca))
  );

  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {feedback.msg && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: feedback.type === "error" ? "#f8d7da" : "#d4edda",
            border: feedback.type === "error" ? "1px solid #dc3545" : "1px solid #28a745",
            color: feedback.type === "error" ? "#721c24" : "#155724",
            fontWeight: "bold",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          {feedback.type === "error" ? "❌ " : "✅ "}{feedback.msg}
        </div>
      )}

      <MapaADM
        pontos={listaCaminhoes}
        onMapClick={handleMapClick}
        mode="CAMINHAO"
        containerHeight="100%"
        containerWidth="100%"
      />

      {formEditar.latitude && formEditar.longitude && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "10px",
            zIndex: 999,
            padding: "8px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            border: formEditar.id ? "2px solid #007bff" : "1px solid #4CAF50",
          }}
        >
          <div style={{ fontWeight: "bold", color: formEditar.id ? "#0056b3" : "#0A3B1A", marginBottom: "3px" }}>
            🗺️ Localização {formEditar.id ? "do Caminhão" : "selecionada"}
          </div>
          <div style={{ fontFamily: "monospace" }}>
            Lat: {parseFloat(formEditar.latitude).toFixed(6)}
            <br />
            Long: {parseFloat(formEditar.longitude).toFixed(6)}
          </div>
          {formEditar.placa && (
            <div style={{ marginTop: "5px", fontSize: "0.75rem", color: "#333", fontStyle: "italic" }}>
              Placa: {formEditar.placa}
            </div>
          )}
        </div>
      )}

      {formEditar.id && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "10px",
            zIndex: 999,
            padding: "8px 12px",
            backgroundColor: "rgba(0, 123, 255, 0.9)",
            color: "white",
            borderRadius: "5px",
            fontSize: "0.8rem",
            textAlign: "center",
            maxWidth: "200px",
          }}
        >
          💡 Clique no mapa para alterar a localização
        </div>
      )}
    </div>
  );

  return (
    <ScreenLayout
      title="Gerenciamento de Caminhões"
      rightContent={RightSideContent}
    >
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

      <div className="card-edit-form" style={{ marginBottom: "20px" }}>
        <h3>Lista de Caminhões</h3>
        <div className="table-wrapper-scroll" style={{ maxHeight: "300px" }}>
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
              {loading && !listaCaminhoes.length ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    Carregando...
                  </td>
                </tr>
              ) : caminhoesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    {termoBusca ? "Nenhum caminhão encontrado" : "Nenhum caminhão cadastrado"}
                  </td>
                </tr>
              ) : (
                caminhoesFiltrados.map((cam) => (
                  <tr
                    key={cam.id}
                    onClick={() => selecionarCaminhao(cam)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: formEditar.id === cam.id ? "#e8f4ff" : "transparent",
                      borderLeft: formEditar.id === cam.id ? "3px solid #007bff" : "none",
                    }}
                  >
                    <td>{cam.placa}</td>
                    <td>{cam.modelo || "-"}</td>
                    <td>
                      <span
                        className={`status ${
                          cam.statusCaminhao === "ATIVO"
                            ? "disponivel"
                            : cam.statusCaminhao === "EM_MANUTENCAO"
                            ? "manutencao"
                            : cam.statusCaminhao === "EM_VIAGEM"
                            ? "em-viagem"
                            : "inativo"
                        }`}
                      >
                        {cam.statusCaminhao}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={(e) => { e.stopPropagation(); selecionarCaminhao(cam); }}
                        title="Editar caminhão"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formEditar.id ? (
        <div className="card-edit-form">
          <h3>Editando: {formEditar.placa}</h3>

          <label>Placa</label>
          <input name="placa" value={formEditar.placa} onChange={handleFormChange} placeholder="ABC-1234" required />

          <label>Modelo</label>
          <input name="modelo" value={formEditar.modelo} onChange={handleFormChange} placeholder="Ex: Scania R450" />

          <label>Latitude</label>
          <input name="latitude" value={formEditar.latitude} onChange={handleFormChange} placeholder="-23.5505" />

          <label>Longitude</label>
          <input name="longitude" value={formEditar.longitude} onChange={handleFormChange} placeholder="-46.6333" />

          <label>Status</label>
          <select name="statusCaminhao" value={formEditar.statusCaminhao} onChange={handleFormChange}>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
            <option value="EM_MANUTENCAO">EM MANUTENÇÃO</option>
            <option value="EM_VIAGEM">EM VIAGEM</option>
          </select>

          <div className="button-group">
            <button className="btn-action btn-save" onClick={salvarEdicao} disabled={loading || !formEditar.placa}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button className="btn-action btn-delete" onClick={excluirCaminhao} disabled={loading}>
              Deletar
            </button>
            <button className="btn-action" onClick={limparForm} disabled={loading} style={{ background: "#6c757d" }}>
              Limpar
            </button>
          </div>
        </div>
      ) : (
        <div className="card-edit-form">
          <h3>Instruções</h3>
          <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", fontSize: "0.9rem" }}>
            <p><strong>Para editar um caminhão:</strong></p>
            <ol style={{ margin: "10px 0 10px 20px", padding: 0 }}>
              <li>Selecione um caminhão na tabela acima</li>
              <li>Os dados aparecerão no formulário</li>
              <li>Clique no mapa para alterar a localização</li>
              <li>Clique em "Salvar" para confirmar as alterações</li>
            </ol>
            <p style={{ marginTop: "10px", fontStyle: "italic" }}>
              💡 Use a barra de busca para filtrar caminhões por placa ou modelo
            </p>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
}

export default PageGerenCaminhao;
