
import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaSimulacao from "../../mapas/MapaSimulacao";
import { API_BASE_URL } from "../../../config/api";
import "./CadastroRotas.css";

function CadastroRotas() {
  // --- STATES ---
  const [pontos, setPontos] = useState([]);
  const [nomeRota, setNomeRota] = useState("");
  const [pontoDeColetaId, setPontoDeColetaId] = useState("1"); // ID padrão ou selecionável

  const [pontoInicial, setPontoInicial] = useState({
    nome: "",
    lat: "",
    lng: "",
  });
  const [pontoFinal, setPontoFinal] = useState({ nome: "", lat: "", lng: "" });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // --- EFEITOS ---
  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`);
        if (!res.ok) throw new Error("Erro ao carregar pontos");
        const data = await res.json();
        setPontos(Array.isArray(data) ? data : []);
        
        // Se houver pontos, seleciona o primeiro por padrão
        if (data.length > 0 && !pontoDeColetaId) {
          setPontoDeColetaId(data[0].id.toString());
        }
      } catch (err) {
        console.error("Erro ao carregar pontos:", err);
        setErro("Não foi possível carregar a lista de pontos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPontos();
  }, []);

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErro("");
    setSucesso("");

    // Validações
    if (!nomeRota) {
      setErro("Preencha o nome da rota.");
      return;
    }
    
    if (!pontoInicial.lat || !pontoInicial.lng || !pontoFinal.lat || !pontoFinal.lng) {
      setErro("Preencha as coordenadas dos pontos inicial e final.");
      return;
    }
    
    if (!pontoDeColetaId) {
      setErro("Selecione um ponto de coleta.");
      return;
    }

    try {
      // ⚠️ **PAYLOAD CORRETO:** O back-end espera nome, pontoDeColetaId e coordenadas
      const payload = {
        nome: nomeRota,
        pontoDeColetaId: parseInt(pontoDeColetaId), // ⚠️ OBRIGATÓRIO para o back-end
        coordenadas: [
          {
            latitude: parseFloat(pontoInicial.lat),
            longitude: parseFloat(pontoInicial.lng),
          },
          {
            latitude: parseFloat(pontoFinal.lat),
            longitude: parseFloat(pontoFinal.lng),
          },
        ],
      };

      console.log("📤 Enviando payload:", payload);

      const res = await fetch(`${API_BASE_URL}/rotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Status da resposta:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erro da API:", errorText);
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ Rota cadastrada:", data);

      setSucesso(`Rota "${data.nome}" cadastrada com sucesso! ID: ${data.id}`);
      
      // Limpa o formulário (mantém pontoDeColetaId selecionado)
      setNomeRota("");
      setPontoInicial({ nome: "", lat: "", lng: "" });
      setPontoFinal({ nome: "", lat: "", lng: "" });
      
    } catch (err) {
      console.error("Erro completo:", err);
      setErro(err.message || "Erro inesperado ao cadastrar rota.");
    }
  };

  // --- LÓGICA DO MAPA ---
  const visualPontoA =
    pontoInicial.lat && pontoInicial.lng
      ? { lat: parseFloat(pontoInicial.lat), lng: parseFloat(pontoInicial.lng) }
      : null;

  const visualPontoB =
    pontoFinal.lat && pontoFinal.lng
      ? { lat: parseFloat(pontoFinal.lat), lng: parseFloat(pontoFinal.lng) }
      : null;

  const handleMapClick = (latLng) => {
    if (!pontoInicial.lat) {
      setPontoInicial((prev) => ({
        ...prev,
        lat: latLng.lat.toString(),
        lng: latLng.lng.toString(),
      }));
    } else {
      setPontoFinal((prev) => ({ 
        ...prev, 
        lat: latLng.lat.toString(), 
        lng: latLng.lng.toString() 
      }));
    }
  };

  // --- RENDER ---
  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Feedback Overlay */}
      {(erro || sucesso) && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: erro ? "#f8d7da" : "#d4edda",
            border: erro ? "1px solid #dc3545" : "1px solid #28a745",
            color: erro ? "#721c24" : "#155724",
            fontWeight: "bold",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          {erro ? "❌ " + erro : "✅ " + sucesso}
        </div>
      )}

      <MapaSimulacao
        pontoA={visualPontoA}
        pontoB={visualPontoB}
        onMapClick={handleMapClick}
        pontosRota={[]}
        posicaoCaminhao={null}
      />
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Rotas" rightContent={RightSideContent}>
      {/* FORMULÁRIO ESQUERDO */}
      <div className="cardInfoRota">
        <label>Nome da Rota *</label>
        <input
          type="text"
          placeholder="Ex: Rota Centro-Norte"
          value={nomeRota}
          onChange={(e) => setNomeRota(e.target.value)}
          required
        />

        <label>Ponto de Coleta Associado *</label>
        <select
          value={pontoDeColetaId}
          onChange={(e) => setPontoDeColetaId(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {loading ? (
            <option>Carregando pontos...</option>
          ) : pontos.length === 0 ? (
            <option value="">Nenhum ponto disponível</option>
          ) : (
            <>
              <option value="">Selecione um ponto de coleta</option>
              {pontos.map((ponto) => (
                <option key={ponto.id} value={ponto.id}>
                  {ponto.nome} (ID: {ponto.id})
                </option>
              ))}
            </>
          )}
        </select>
        
        <small style={{ color: "#666", fontSize: "0.8rem" }}>
          * Campo obrigatório para o back-end
        </small>
      </div>

      <div className="row-cards">
        {/* Ponto Inicial */}
        <div className="card-small">
          <h4>Ponto Inicial *</h4>
          <input
            type="text"
            placeholder="Nome (Opcional)"
            value={pontoInicial.nome}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, nome: e.target.value })
            }
          />
          <label>Latitude *</label>
          <input
            type="number"
            step="any"
            placeholder="-12.97"
            value={pontoInicial.lat}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, lat: e.target.value })
            }
            required
          />
          <label>Longitude *</label>
          <input
            type="number"
            step="any"
            placeholder="-38.51"
            value={pontoInicial.lng}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, lng: e.target.value })
            }
            required
          />
        </div>

        {/* Ponto Final */}
        <div className="card-small">
          <h4>Ponto Final *</h4>
          <input
            type="text"
            placeholder="Nome (Opcional)"
            value={pontoFinal.nome}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, nome: e.target.value })
            }
          />
          <label>Latitude *</label>
          <input
            type="number"
            step="any"
            placeholder="-12.98"
            value={pontoFinal.lat}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, lat: e.target.value })
            }
            required
          />
          <label>Longitude *</label>
          <input
            type="number"
            step="any"
            placeholder="-38.50"
            value={pontoFinal.lng}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, lng: e.target.value })
            }
            required
          />
        </div>
      </div>

      <button 
        className="btn-success" 
        onClick={handleSubmit} 
        disabled={loading || !pontoDeColetaId}
      >
        {loading ? "Carregando..." : "Cadastrar Rota"}
      </button>

      {/* Instruções */}
      <div style={{ 
        marginTop: "15px", 
        padding: "10px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        fontSize: "0.85rem",
        color: "#666"
      }}>
        <p><strong>💡 Instruções:</strong></p>
        <ol style={{ margin: "5px 0 0 15px", padding: 0 }}>
          <li>Preencha o nome da rota</li>
          <li>Selecione um ponto de coleta (obrigatório para o back-end)</li>
          <li>Digite ou clique no mapa para definir os pontos A e B</li>
          <li>Clique em "Cadastrar Rota"</li>
        </ol>
        <p style={{ marginTop: "8px", fontStyle: "italic" }}>
          <small>Obs.: O campo "descrição" foi removido pois não existe no back-end.</small>
        </p>
      </div>
    </ScreenLayout>
  );
}

export default CadastroRotas;
