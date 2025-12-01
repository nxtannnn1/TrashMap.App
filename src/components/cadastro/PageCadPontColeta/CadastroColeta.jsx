import React, { useState } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaADM from "../../mapas/MapaADM"; // Import do Mapa
import { API_BASE_URL } from "../../../config/api";
import "./CadastroColeta.css";

function CadastroColeta() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  // Estado (Nome e Coordenadas)
  const [form, setForm] = useState({
    nome: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DO MAPA ---

  // 1. Função que recebe o clique do mapa e preenche o form
  const handleMapClick = (latLng) => {
    setForm((prev) => ({
      ...prev,
      latitude: latLng.lat,
      longitude: latLng.lng,
    }));
  };

  // 2. Cria um ponto visual para mostrar no mapa onde o usuário clicou/digitou
  const pontoPreview =
    form.latitude && form.longitude
      ? [
          {
            id: "temp",
            nome: form.nome || "Novo Ponto",
            latitude: form.latitude,
            longitude: form.longitude,
          },
        ]
      : [];

  // --- LÓGICA DE API ---

  async function cadastrarPonto() {
    if (!form.nome || !form.latitude || !form.longitude) {
      setFeedback({
        type: "error",
        msg: "Preencha Nome, Latitude e Longitude.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        coordenadas: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
      };

      const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro API: ${res.status}`);

      setFeedback({ type: "success", msg: "Ponto cadastrado com sucesso!" });
      setForm({ nome: "", latitude: "", longitude: "" });
    } catch (err) {
      setFeedback({ type: "error", msg: `Erro: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  // --- CONTEÚDO VISUAL ---

  const RightSideContent = (
    <div className="right-panel-container">
      <div className="map-section" style={{ position: "relative" }}>
        {/* MAPA REAL */}
        <div style={{ width: "100%", height: "100%" }}>
          <MapaADM
            onMapClick={handleMapClick}
            pontos={pontoPreview} // Mostra o marcador onde você clicou
          />
        </div>

        {/* FEEDBACK FLUTUANTE (OVERLAY) */}
        {feedback.msg && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              fontWeight: "bold",
              backgroundColor:
                feedback.type === "error" ? "#f8d7da" : "#d4edda",
              color: feedback.type === "error" ? "#721c24" : "#155724",
            }}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Instruções Abaixo do Mapa */}
      <div className="table-section">
        <h3>Instruções</h3>
        <div className="table-wrapper">
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            📍 Clique no mapa para definir a localização exata do ponto de
            coleta.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Pontos" rightContent={RightSideContent}>
      <div className="card-form">
        <label>Nome do Ponto</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Ecoponto Centro"
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Latitude</label>
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder="-12.97"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitude</label>
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="-38.50"
            />
          </div>
        </div>
      </div>

      <button
        className="btn-success"
        onClick={cadastrarPonto}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Cadastrar Ponto"}
      </button>
    </ScreenLayout>
  );
}

export default CadastroColeta;
