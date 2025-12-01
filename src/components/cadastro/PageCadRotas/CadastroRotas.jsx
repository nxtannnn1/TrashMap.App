import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaSimulacao from "../../mapas/MapaSimulacao"; // Importando o mapa
import { API_BASE_URL } from "../../../config/api";
import "./CadastroRotas.css";

function CadastroRotas() {
  // --- LÓGICA ---
  const [pontos, setPontos] = useState([]);
  const [nomeRota, setNomeRota] = useState("");
  const [descricao, setDescricao] = useState("");

  const [pontoInicial, setPontoInicial] = useState({
    nome: "",
    lat: "",
    lng: "",
  });
  const [pontoFinal, setPontoFinal] = useState({ nome: "", lat: "", lng: "" });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`);
        if (!res.ok) throw new Error("Erro ao carregar pontos");
        const data = await res.json();
        setPontos(Array.isArray(data) ? data : []);
      } catch (err) {
        setErro("Não foi possível carregar a lista de pontos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPontos();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nomeRota || !pontoInicial.lat || !pontoFinal.lat) {
      setErro("Preencha o nome da rota e as coordenadas dos pontos.");
      return;
    }

    try {
      const payload = {
        nome: nomeRota,
        descricao: descricao,
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

      const res = await fetch(`${API_BASE_URL}/rotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar rota.");

      setSucesso("Rota cadastrada com sucesso!");
      setNomeRota("");
      setDescricao("");
      setPontoInicial({ nome: "", lat: "", lng: "" });
      setPontoFinal({ nome: "", lat: "", lng: "" });
    } catch (err) {
      console.error(err);
      setErro(err.message || "Erro inesperado.");
    }
  };

  // --- LÓGICA DO MAPA ---

  // Converte os estados do form para o formato que o MapaSimulacao entende
  const visualPontoA =
    pontoInicial.lat && pontoInicial.lng
      ? { lat: parseFloat(pontoInicial.lat), lng: parseFloat(pontoInicial.lng) }
      : { lat: "", lng: "" };

  const visualPontoB =
    pontoFinal.lat && pontoFinal.lng
      ? { lat: parseFloat(pontoFinal.lat), lng: parseFloat(pontoFinal.lng) }
      : { lat: "", lng: "" };

  // Ao clicar no mapa: Preenche Origem primeiro, depois Destino
  const handleMapClick = (latLng) => {
    if (!pontoInicial.lat) {
      setPontoInicial((prev) => ({
        ...prev,
        lat: latLng.lat,
        lng: latLng.lng,
      }));
    } else {
      setPontoFinal((prev) => ({ ...prev, lat: latLng.lat, lng: latLng.lng }));
    }
  };

  // --- CONTEÚDO VISUAL ---

  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Mensagens de Feedback (Overlay sobre o mapa) */}
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
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: erro ? "1px solid #dc3545" : "1px solid #28a745",
            color: erro ? "#721c24" : "#155724",
            fontWeight: "bold",
          }}
        >
          {erro || sucesso}
        </div>
      )}

      {/* O Mapa Real */}
      <MapaSimulacao
        pontoA={visualPontoA}
        pontoB={visualPontoB}
        onMapClick={handleMapClick}
        pontosRota={[]} // Passamos array vazio pois aqui é só cadastro, não simulação
        posicaoCaminhao={null}
      />
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Rotas" rightContent={RightSideContent}>
      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="cardInfoRota">
        <label>Nome da Rota</label>
        <input
          type="text"
          placeholder="Digite o nome da rota"
          value={nomeRota}
          onChange={(e) => setNomeRota(e.target.value)}
        />

        <label>Descrição</label>
        <input
          type="text"
          placeholder="Digite a descrição da rota"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="row-cards">
        {/* Ponto Inicial */}
        <div className="card-small">
          <h4>Ponto Inicial</h4>
          <input
            type="text"
            placeholder="Nome (Opcional)"
            value={pontoInicial.nome}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, nome: e.target.value })
            }
          />
          <label>Latitude</label>
          <input
            type="number"
            placeholder="-12.97"
            value={pontoInicial.lat}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, lat: e.target.value })
            }
          />
          <label>Longitude</label>
          <input
            type="number"
            placeholder="-38.51"
            value={pontoInicial.lng}
            onChange={(e) =>
              setPontoInicial({ ...pontoInicial, lng: e.target.value })
            }
          />
        </div>

        {/* Ponto Final */}
        <div className="card-small">
          <h4>Ponto Final</h4>
          <input
            type="text"
            placeholder="Nome (Opcional)"
            value={pontoFinal.nome}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, nome: e.target.value })
            }
          />
          <label>Latitude</label>
          <input
            type="number"
            placeholder="-12.98"
            value={pontoFinal.lat}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, lat: e.target.value })
            }
          />
          <label>Longitude</label>
          <input
            type="number"
            placeholder="-38.50"
            value={pontoFinal.lng}
            onChange={(e) =>
              setPontoFinal({ ...pontoFinal, lng: e.target.value })
            }
          />
        </div>
      </div>

      <button className="btn-success" onClick={handleSubmit} disabled={loading}>
        {loading ? "Carregando..." : "Cadastrar Rota"}
      </button>

      {/* Dica para o usuário */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#666",
          marginTop: "10px",
        }}
      >
        💡 Dica: Clique no mapa para preencher as coordenadas automaticamente.
      </p>
    </ScreenLayout>
  );
}

export default CadastroRotas;
