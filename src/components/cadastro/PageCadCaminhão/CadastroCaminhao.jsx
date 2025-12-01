import React, { useState } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaADM from "../../mapas/MapaADM"; // Importando o Mapa
import { API_BASE_URL } from "../../../config/api";
import "./CadastroCaminhao.css";

function CadastroCaminhao() {
  // --- STATES ---
  const [form, setForm] = useState({
    modelo: "",
    placa: "",
    capacidade: "",
    motoristaId: "",
    statusCaminhao: "ATIVO",
    // Adicionei coordenadas para poder enviar ao backend
    latitude: 0,
    longitude: 0,
  });

  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Função para capturar o clique no mapa
  const handleMapClick = (latLng) => {
    setForm((prev) => ({
      ...prev,
      latitude: latLng.lat,
      longitude: latLng.lng,
    }));
    // Feedback visual rápido
    setFeedback({
      type: "success",
      msg: `Localização definida: ${latLng.lat.toFixed(
        4
      )}, ${latLng.lng.toFixed(4)}`,
    });
  };

  // --- FUNÇÃO DE CADASTRO ---
  const cadastrarCaminhao = async () => {
    setFeedback({ type: "", msg: "" });

    // Validação simples
    if (!form.placa || !form.modelo) {
      setFeedback({ type: "error", msg: "Preencha Placa e Modelo." });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        placa: form.placa,
        modelo: form.modelo,
        capacidade: form.capacidade,
        motoristaId: form.motoristaId,
        statusCaminhao: form.statusCaminhao,
        // Agora envia as coordenadas clicadas (ou 0 se não clicou)
        coordenadas: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
      };

      const res = await fetch(`${API_BASE_URL}/caminhoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro API: ${res.status}`);

      setFeedback({ type: "success", msg: "Caminhão cadastrado com sucesso!" });

      // Limpar formulário
      setForm({
        modelo: "",
        placa: "",
        capacidade: "",
        motoristaId: "",
        statusCaminhao: "ATIVO",
        latitude: 0,
        longitude: 0,
      });
    } catch (error) {
      setFeedback({ type: "error", msg: `Erro: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // --- CONTEÚDO DIREITA (Mapa) ---
  const RightSideContent = (
    <div className="right-panel-container">
      {/* Parte Superior: MAPA REAL */}
      <div className="map-section" style={{ position: "relative" }}>
        {/* Container para garantir tamanho do mapa */}
        <div style={{ width: "100%", height: "100%" }}>
          <MapaADM
            onMapClick={handleMapClick}
            pontos={[]} // Array vazio pois é cadastro, não visualização de pontos
          />
        </div>

        {/* Mensagem de Feedback Flutuante (Overlay) */}
        {feedback.msg && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              padding: "10px 20px",
              backgroundColor:
                feedback.type === "error" ? "#f8d7da" : "#d4edda",
              color: feedback.type === "error" ? "#721c24" : "#155724",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              fontWeight: "bold",
            }}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Parte Inferior: Instruções/Tabela */}
      <div className="table-section">
        <h3>Frota Recente</h3>
        <div className="table-wrapper">
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            💡 Dica: Clique no mapa acima para definir a localização inicial
            (Garagem/Pátio) do caminhão.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Caminhões" rightContent={RightSideContent}>
      {/* Formulário na Esquerda */}
      <div className="card-form-caminhao">
        <label>Modelo do Caminhão</label>
        <input
          name="modelo"
          type="text"
          placeholder="Ex: Volvo VM 270"
          value={form.modelo}
          onChange={handleChange}
        />

        <label>Placa</label>
        <input
          name="placa"
          type="text"
          placeholder="ABC-1234"
          value={form.placa}
          onChange={handleChange}
        />

        <label>Capacidade (Toneladas)</label>
        <input
          name="capacidade"
          type="number"
          placeholder="Ex: 10"
          value={form.capacidade}
          onChange={handleChange}
        />

        <label>Motorista Responsável</label>
        <select
          name="motoristaId"
          value={form.motoristaId}
          onChange={handleChange}
        >
          <option value="">Selecione um motorista...</option>
          <option value="1">João Silva (Mock)</option>
          <option value="2">Maria Souza (Mock)</option>
        </select>

        <label>Status</label>
        <select
          name="statusCaminhao"
          value={form.statusCaminhao}
          onChange={handleChange}
        >
          <option value="ATIVO">ATIVO</option>
          <option value="EM_MANUTENCAO">EM MANUTENÇÃO</option>
          <option value="INATIVO">INATIVO</option>
        </select>

        {/* Feedback visual se tem coordenada selecionada */}
        {form.latitude !== 0 && (
          <small style={{ color: "#036b1a", marginTop: "5px" }}>
            📍 Localização definida: {form.latitude.toFixed(4)},{" "}
            {form.longitude.toFixed(4)}
          </small>
        )}
      </div>

      <button
        className="btn-success"
        onClick={cadastrarCaminhao}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Cadastrar Caminhão"}
      </button>
    </ScreenLayout>
  );
}

export default CadastroCaminhao;
