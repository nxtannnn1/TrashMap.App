import React, { useState, useRef, useEffect } from "react";
import MapaSimulacao from "../mapas/MapaSimulacao";
import API_BASE_URL from "../../config/api";
import ScreenLayout from "../ScreenLayout/ScreenLayout";
import "./SimulacaoCaminhao.css";
import { GoogleMap, Marker } from "@react-google-maps/api";

function SimulacaoCaminhao() {
  const [pontoA, setPontoA] = useState({ lat: null, lng: null });
  const [pontoB, setPontoB] = useState({ lat: null, lng: null });
  const [velocidade, setVelocidade] = useState(1000);
  const [simulando, setSimulando] = useState(false);
  const [pontosIntermediarios, setPontosIntermediarios] = useState([]);
  const [caminhaoId, setCaminhaoId] = useState("1");
  const [posicaoCaminhao, setPosicaoCaminhao] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [pontosDeColeta, setPontosDeColeta] = useState([]);

  const intervaloRef = useRef(null);
  const pontosCalculadosRef = useRef([]);
  const indiceAtualRef = useRef(0);

  // Carrega os pontos de coleta da API
  async function carregarPontosDeColeta() {
    try {
      const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`);
      if (!res.ok) throw new Error("Erro ao carregar pontos de coleta");
      const data = await res.json();
      setPontosDeColeta(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    carregarPontosDeColeta();
  }, []);

  // Verificação da API do Google Maps
  useEffect(() => {
    if (window.google) setApiLoaded(true);
    else {
      const checkApi = setInterval(() => {
        if (window.google) {
          setApiLoaded(true);
          clearInterval(checkApi);
        }
      }, 500);
      return () => clearInterval(checkApi);
    }
  }, []);

  const calcularRota = async () => {
    if (!pontoA.lat || !pontoA.lng || !pontoB.lat || !pontoB.lng) {
      alert("Preencha ambos os pontos A e B");
      return;
    }
    if (!apiLoaded) {
      alert("Aguarde a API do Google Maps carregar");
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: new window.google.maps.LatLng(
              parseFloat(pontoA.lat),
              parseFloat(pontoA.lng)
            ),
            destination: new window.google.maps.LatLng(
              parseFloat(pontoB.lat),
              parseFloat(pontoB.lng)
            ),
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") resolve(result);
            else reject(new Error(`Erro ao calcular rota: ${status}`));
          }
        );
      });

      const path = result.routes[0].overview_path;
      const pontos = path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));

      pontosCalculadosRef.current = pontos;
      setPontosIntermediarios(pontos);
      alert(`✅ Rota calculada com ${pontos.length} pontos`);
    } catch (error) {
      console.error("Erro ao calcular rota:", error);
      alert("❌ Erro ao calcular rota: " + error.message);
    }
  };

  const enviarPosicao = async (posicao) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/caminhoes/${caminhaoId}/localizacao`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: posicao.lat,
            longitude: posicao.lng,
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao enviar posição");
      console.log("📍 Posição enviada:", posicao);
    } catch (error) {
      console.error("Erro ao enviar posição:", error);
    }
  };

  const iniciarSimulacao = () => {
    if (pontosCalculadosRef.current.length === 0) {
      alert("Calcule a rota primeiro");
      return;
    }

    setSimulando(true);
    indiceAtualRef.current = 0;
    const primeiraPosicao = pontosCalculadosRef.current[0];
    setPosicaoCaminhao(primeiraPosicao);
    enviarPosicao(primeiraPosicao);

    intervaloRef.current = setInterval(() => {
      if (indiceAtualRef.current < pontosCalculadosRef.current.length - 1) {
        indiceAtualRef.current++;
        const posicaoAtual = pontosCalculadosRef.current[indiceAtualRef.current];
        setPosicaoCaminhao(posicaoAtual);
        enviarPosicao(posicaoAtual);
      } else {
        pararSimulacao();
        alert("🎉 Caminhão chegou ao destino!");
      }
    }, velocidade);
  };

  const pararSimulacao = () => {
    setSimulando(false);
    setPosicaoCaminhao(null);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const handleMapClick = (coordenadas) => {
    if (!pontoA.lat || !pontoA.lng) {
      setPontoA(coordenadas);
      alert("✅ Ponto A definido! Agora clique no Ponto B");
    } else if (!pontoB.lat || !pontoB.lng) {
      setPontoB(coordenadas);
      alert('✅ Ponto B definido! Clique em "Calcular Rota"');
    } else {
      setPontoA(coordenadas);
      setPontoB({ lat: null, lng: null });
      setPontosIntermediarios([]);
      pontosCalculadosRef.current = [];
      setPosicaoCaminhao(null);
      alert("🔄 Ponto A redefinido! Clique no Ponto B");
    }
  };

  const limparRota = () => {
    setPontoA({ lat: null, lng: null });
    setPontoB({ lat: null, lng: null });
    setPontosIntermediarios([]);
    pontosCalculadosRef.current = [];
    setPosicaoCaminhao(null);
    pararSimulacao();
    alert("🧹 Rota limpa!");
  };

  const RightSideContent = (
    <div className="map-container-full">
      <div className="status-overlay-container">
        {simulando && (
          <div className="status-box status-active">
            <strong>🚛 Simulação em andamento:</strong> Ponto{" "}
            {indiceAtualRef.current + 1} de {pontosCalculadosRef.current.length}
          </div>
        )}
        {pontosIntermediarios.length > 0 && !simulando && (
          <div className="status-box status-ready">
            <strong>📊 Rota calculada:</strong> {pontosIntermediarios.length} pontos - Pronto para simular!
          </div>
        )}
      </div>

      <MapaSimulacao
        onMapClick={handleMapClick}
        pontoA={pontoA}
        pontoB={pontoB}
        pontosRota={pontosIntermediarios}
        posicaoCaminhao={posicaoCaminhao}
        pontosDeColeta={pontosDeColeta} // ✅ adicionado
      />
    </div>
  );

  return (
    <ScreenLayout title="Simulador de Rotas" rightContent={RightSideContent}>
      {/* Controles */}
      <div className="card-control-sim">
        <label>ID do Caminhão</label>
        <input
          type="number"
          value={caminhaoId}
          onChange={(e) => setCaminhaoId(e.target.value)}
          placeholder="ID"
          min="1"
        />

        <label>Velocidade: {velocidade}ms</label>
        <input
          type="range"
          value={velocidade}
          onChange={(e) => setVelocidade(parseInt(e.target.value))}
          min="100"
          max="5000"
          step="100"
        />
        <small className="hint-text">Menor valor = Mais rápido</small>
      </div>

      {/* Coordenadas */}
      <div className="card-control-sim">
        <h4>Coordenadas</h4>
        <div className="coord-group">
          <label className="sub-label">Ponto A (Origem)</label>
          <input
            type="number"
            step="any"
            value={pontoA.lat || ""}
            placeholder="Lat A"
            onChange={(e) =>
              setPontoA((prev) => ({ ...prev, lat: e.target.value }))
            }
          />
          <input
            type="number"
            step="any"
            value={pontoA.lng || ""}
            placeholder="Lng A"
            onChange={(e) =>
              setPontoA((prev) => ({ ...prev, lng: e.target.value }))
            }
          />
        </div>

        <div className="coord-group">
          <label className="sub-label">Ponto B (Destino)</label>
          <input
            type="number"
            step="any"
            value={pontoB.lat || ""}
            placeholder="Lat B"
            onChange={(e) =>
              setPontoB((prev) => ({ ...prev, lat: e.target.value }))
            }
          />
          <input
            type="number"
            step="any"
            value={pontoB.lng || ""}
            placeholder="Lng B"
            onChange={(e) =>
              setPontoB((prev) => ({ ...prev, lng: e.target.value }))
            }
          />
        </div>

        <p className="hint-click">💡 Dica: Clique no mapa para definir A e B.</p>
      </div>

      {/* Botões */}
      <div className="sim-buttons-grid">
        <button
          className="btn-sim btn-calc"
          onClick={calcularRota}
          disabled={simulando || !apiLoaded}
        >
          🗺️ Calcular
        </button>
        <button
          className="btn-sim btn-start"
          onClick={iniciarSimulacao}
          disabled={simulando || pontosIntermediarios.length === 0}
        >
          ▶️ Iniciar
        </button>
        <button
          className="btn-sim btn-stop"
          onClick={pararSimulacao}
          disabled={!simulando}
        >
          ⏹️ Parar
        </button>
        <button className="btn-sim btn-clear" onClick={limparRota}>
          🗑️ Limpar
        </button>
      </div>
    </ScreenLayout>
  );
}

export default SimulacaoCaminhao;
