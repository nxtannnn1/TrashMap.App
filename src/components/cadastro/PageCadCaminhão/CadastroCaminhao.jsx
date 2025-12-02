
import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaADM from "../../mapas/MapaADM";
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
    latitude: 0,
    longitude: 0,
  });

  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [listaCaminhoes, setListaCaminhoes] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(false);

  // Carrega lista de caminhões ao iniciar
  useEffect(() => {
    carregarCaminhoes();
  }, []);

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
      msg: `Localização definida: ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`,
    });
  };

  // Carregar lista de caminhões
  const carregarCaminhoes = async () => {
    setCarregandoLista(true);
    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes`);
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setListaCaminhoes(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error("Erro ao carregar caminhões:", error);
    } finally {
      setCarregandoLista(false);
    }
  };

  // --- FUNÇÃO DE CADASTRO ---
  const cadastrarCaminhao = async () => {
    setFeedback({ type: "", msg: "" });

    // Validação simples
    if (!form.placa || !form.modelo) {
      setFeedback({ type: "error", msg: "Preencha Placa e Modelo." });
      return;
    }

    // Validação de placa
    const placaRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
    if (!placaRegex.test(form.placa.replace('-', '').toUpperCase())) {
      setFeedback({ type: "error", msg: "Placa inválida. Use o formato ABC-1234 ou ABC1D23." });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        placa: form.placa.toUpperCase(),
        modelo: form.modelo,
        capacidade: form.capacidade ? parseFloat(form.capacidade) : 0,
        motoristaId: form.motoristaId,
        statusCaminhao: form.statusCaminhao,
        coordenadas: {
          latitude: parseFloat(form.latitude) || -12.9326,
          longitude: parseFloat(form.longitude) || -38.5067,
        },
      };

      const res = await fetch(`${API_BASE_URL}/caminhoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro API: ${res.status}`);
      }

      const resultado = await res.json();
      
      setFeedback({ 
        type: "success", 
        msg: `Caminhão ${form.placa.toUpperCase()} cadastrado com sucesso!` 
      });

      // Atualiza a lista de caminhões
      carregarCaminhoes();

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
      setFeedback({ 
        type: "error", 
        msg: `Erro: ${error.message || "Falha ao cadastrar caminhão"}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpar feedback após 5 segundos
  useEffect(() => {
    if (feedback.msg) {
      const timer = setTimeout(() => {
        setFeedback({ type: "", msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback.msg]);

  // --- CONTEÚDO DIREITA (Mapa) ---
  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Feedback Overlay */}
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
        onMapClick={handleMapClick}
        pontos={listaCaminhoes}
        mode="CAMINHAO"
        containerHeight="100%"
        containerWidth="100%"
      />

      {/* Instrução sobre o clique no mapa */}
      {form.latitude === 0 && form.longitude === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            padding: "10px 15px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "5px",
            fontSize: "0.85rem",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          💡 <strong>Clique no mapa</strong> para definir a localização inicial do caminhão
        </div>
      )}

      {/* Mostrar coordenadas selecionadas */}
      {form.latitude !== 0 && form.longitude !== 0 && (
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
            border: "1px solid #4CAF50"
          }}
        >
          <div style={{ fontWeight: "bold", color: "#0A3B1A", marginBottom: "3px" }}>
            🗺️ Localização definida
          </div>
          <div style={{ fontFamily: "monospace" }}>
            Lat: {form.latitude.toFixed(6)}
            <br />
            Long: {form.longitude.toFixed(6)}
          </div>
        </div>
      )}

      {/* Lista de Caminhões Recentes (no canto inferior direito) */}
      {listaCaminhoes.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "10px",
            zIndex: 999,
            width: "250px",
            maxHeight: "200px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #dee2e6",
            overflow: "hidden",
          }}
        >
          <div style={{
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#333" }}>
              🚚 Frota Recente
            </div>
            <button 
              onClick={carregarCaminhoes}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "#007bff",
                padding: "2px 6px"
              }}
              title="Atualizar lista"
            >
              ↻
            </button>
          </div>
          
          <div style={{ 
            maxHeight: "150px", 
            overflowY: "auto",
            fontSize: "0.8rem"
          }}>
            {carregandoLista ? (
              <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
                Carregando...
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={{ padding: "6px 8px", fontSize: "0.75rem", textAlign: "left" }}>Placa</th>
                    <th style={{ padding: "6px 8px", fontSize: "0.75rem", textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCaminhoes.map((cam, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "6px 8px", fontWeight: "bold" }}>{cam.placa}</td>
                      <td style={{ padding: "6px 8px" }}>
                        <span style={{
                          padding: "2px 6px",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          backgroundColor: 
                            cam.statusCaminhao === "ATIVO" ? "#d4edda" :
                            cam.statusCaminhao === "EM_MANUTENCAO" || cam.statusCaminhao === "EM_MANUTENCÃO" ? "#fff3cd" :
                            cam.statusCaminhao === "EM_VIAGEM" ? "#d1ecf1" :
                            "#f8d7da",
                          color: 
                            cam.statusCaminhao === "ATIVO" ? "#155724" :
                            cam.statusCaminhao === "EM_MANUTENCAO" || cam.statusCaminhao === "EM_MANUTENCÃO" ? "#856404" :
                            cam.statusCaminhao === "EM_VIAGEM" ? "#0c5460" :
                            "#721c24"
                        }}>
                          {cam.statusCaminhao}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Caminhões" rightContent={RightSideContent}>
      {/* Formulário na Esquerda */}
      <div className="card-form-caminhao">
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: "20px", 
          color: "#036b1a",
          textAlign: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px"
        }}>
          Dados do Caminhão
        </h3>

        <label>Placa*</label>
        <input
          name="placa"
          type="text"
          placeholder="Ex: ABC-1234 ou ABC1D23"
          value={form.placa}
          onChange={handleChange}
          style={{ textTransform: "uppercase" }}
          required
        />

        <label>Modelo*</label>
        <input
          name="modelo"
          type="text"
          placeholder="Ex: Volvo VM 270"
          value={form.modelo}
          onChange={handleChange}
          required
        />

        <label>Capacidade (Toneladas)</label>
        <input
          name="capacidade"
          type="number"
          placeholder="Ex: 10"
          value={form.capacidade}
          onChange={handleChange}
          min="0"
          step="0.1"
        />

        <label>Motorista Responsável</label>
        <select
          name="motoristaId"
          value={form.motoristaId}
          onChange={handleChange}
        >
          <option value="">Selecione um motorista...</option>
          <option value="1">João Silva</option>
          <option value="2">Maria Souza</option>
          <option value="3">Carlos Oliveira</option>
          <option value="4">Ana Santos</option>
        </select>

        <label>Status</label>
        <select
          name="statusCaminhao"
          value={form.statusCaminhao}
          onChange={handleChange}
        >
          <option value="ATIVO">ATIVO (Disponível)</option>
          <option value="EM_VIAGEM">EM VIAGEM</option>
          <option value="EM_MANUTENCAO">EM MANUTENÇÃO</option>
          <option value="INATIVO">INATIVO</option>
        </select>

        {/* Informações de localização */}
        <div style={{ 
          marginTop: "15px", 
          padding: "12px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "5px",
          border: "1px solid #e9ecef"
        }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#495057" }}>
            📍 Localização
          </label>
          
          {form.latitude !== 0 && form.longitude !== 0 ? (
            <div style={{ fontSize: "0.85rem" }}>
              <div><strong>Latitude:</strong> {form.latitude.toFixed(6)}</div>
              <div><strong>Longitude:</strong> {form.longitude.toFixed(6)}</div>
              <div style={{ fontSize: "0.8rem", color: "#28a745", marginTop: "5px" }}>
                ✓ Localização definida pelo mapa
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
              ⚠️ Clique no mapa ao lado para definir a localização
            </div>
          )}
        </div>

        <small style={{ marginTop: "10px", color: "#6c757d", fontSize: "0.8rem" }}>
          * Campos obrigatórios
        </small>
      </div>

      <button
        className="btn-success"
        onClick={cadastrarCaminhao}
        disabled={loading || !form.placa || !form.modelo}
        style={{
          opacity: (loading || !form.placa || !form.modelo) ? 0.6 : 1,
          cursor: (loading || !form.placa || !form.modelo) ? "not-allowed" : "pointer",
          marginTop: "20px"
        }}
      >
        {loading ? (
          <>
            <span style={{ display: "inline-block", marginRight: "8px" }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid white",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite"
              }}></div>
            </span>
            Cadastrando...
          </>
        ) : (
          "Cadastrar Caminhão"
        )}
      </button>

      {/* Instruções */}
      <div style={{ 
        marginTop: "15px", 
        padding: "12px", 
        backgroundColor: "#e8f5e9", 
        borderRadius: "8px",
        fontSize: "0.85rem",
        color: "#155724"
      }}>
        <p><strong>💡 Instruções:</strong></p>
        <ol style={{ margin: "5px 0 0 15px", padding: 0 }}>
          <li>Preencha placa e modelo (obrigatórios)</li>
          <li>Selecione motorista e status</li>
          <li>Clique no mapa para definir a localização</li>
          <li>Clique em "Cadastrar Caminhão"</li>
        </ol>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ScreenLayout>
  );
}

export default CadastroCaminhao;
