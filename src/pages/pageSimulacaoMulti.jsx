
import React, { useState, useEffect, useRef } from "react";
import ScreenLayout from "../components/ScreenLayout/ScreenLayout";
import MapaADM from "../components/mapas/MapaADM";  // MUDANÇA: Usar MapaADM
import { API_BASE_URL } from "../config/api";

function PageSimulacaoMulti() {
  // --- CONSTANTES ---
  const TOTAL_CAMINHOES = 10;
  const CORES_CAMINHOES = [
    "#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2",
    "#073B4C", "#EF476F", "#FFD166", "#06D6A0", "#7209B7"
  ];
  
  // --- STATES PRINCIPAIS ---
  const [caminhoes, setCaminhoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);
  
  // Estados para cada caminhão
  const [rotas, setRotas] = useState(Array(TOTAL_CAMINHOES).fill(null).map((_, index) => ({
    pontoA: { lat: null, lng: null },
    pontoB: { lat: null, lng: null },
    pontosCalculados: [],
    indiceAtual: 0,
    simulando: false,
    velocidade: 1000,
    cor: CORES_CAMINHOES[index % CORES_CAMINHOES.length],
    placa: `C${index + 1}`
  })));
  
  // Posições atuais dos caminhões
  const [posicoesCaminhoes, setPosicoesCaminhoes] = useState(Array(TOTAL_CAMINHOES).fill(null));
  
  // Controle de seleção
  const [caminhaoSelecionado, setCaminhaoSelecionado] = useState(0);
  
  // Referências para intervalos
  const intervalosRef = useRef(Array(TOTAL_CAMINHOES).fill(null));
  
  // --- EFEITOS INICIAIS ---
  useEffect(() => {
    // Verificar API do Google Maps
    if (window.google) {
      setApiLoaded(true);
    } else {
      const checkApi = setInterval(() => {
        if (window.google) {
          setApiLoaded(true);
          clearInterval(checkApi);
        }
      }, 500);
      return () => clearInterval(checkApi);
    }
  }, []);
  
  useEffect(() => {
    // Carregar caminhões do back-end
    carregarCaminhoes();
  }, []);
  
  // --- FUNÇÕES DA API ---
  const carregarCaminhoes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/caminhoes`);
      if (!response.ok) throw new Error("Erro ao carregar caminhões");
      const data = await response.json();
      setCaminhoes(data.slice(0, TOTAL_CAMINHOES)); // Pegar apenas os primeiros 10
    } catch (error) {
      console.error("Erro ao carregar caminhões:", error);
      // Se não conseguir carregar, criar caminhões fictícios para demonstração
      criarCaminhoesFicticios();
    } finally {
      setLoading(false);
    }
  };
  
  const criarCaminhoesFicticios = () => {
    const caminhoesFicticios = Array.from({ length: TOTAL_CAMINHOES }, (_, i) => ({
      id: i + 1,
      placa: `ABC-${(1000 + i).toString().padStart(3, '0')}`,
      modelo: `Modelo ${i + 1}`,
      statusCaminhao: "ATIVO",
      coordenadas: {
        latitude: -12.9326 + (i * 0.001),
        longitude: -38.5067 + (i * 0.001)
      }
    }));
    setCaminhoes(caminhoesFicticios);
  };
  
  const atualizarLocalizacaoAPI = async (caminhaoId, posicao) => {
    try {
      const response = await fetch(`${API_BASE_URL}/caminhoes/${caminhaoId}/localizacao`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: posicao.lat,
          longitude: posicao.lng
        })
      });
      if (!response.ok) throw new Error("Erro ao atualizar localização");
      console.log(`📍 Caminhão ${caminhaoId} atualizado:`, posicao);
    } catch (error) {
      console.error(`Erro ao atualizar caminhão ${caminhaoId}:`, error);
    }
  };
  
  // --- FUNÇÕES DE SIMULAÇÃO ---
  const calcularRotaParaCaminhao = async (index) => {
    const rota = rotas[index];
    if (!rota.pontoA.lat || !rota.pontoA.lng || !rota.pontoB.lat || !rota.pontoB.lng) {
      alert(`Caminhão ${index + 1}: Preencha ambos os pontos A e B`);
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
              parseFloat(rota.pontoA.lat),
              parseFloat(rota.pontoA.lng)
            ),
            destination: new window.google.maps.LatLng(
              parseFloat(rota.pontoB.lat),
              parseFloat(rota.pontoB.lng)
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
      
      setRotas(prev => {
        const novasRotas = [...prev];
        novasRotas[index] = {
          ...novasRotas[index],
          pontosCalculados: pontos,
          indiceAtual: 0
        };
        return novasRotas;
      });
      
      // Atualizar posição inicial
      if (pontos.length > 0) {
        setPosicoesCaminhoes(prev => {
          const novasPosicoes = [...prev];
          novasPosicoes[index] = pontos[0];
          return novasPosicoes;
        });
      }
      
      alert(`✅ Caminhão ${index + 1}: Rota calculada com ${pontos.length} pontos`);
    } catch (error) {
      console.error(`Erro ao calcular rota para caminhão ${index + 1}:`, error);
      alert(`❌ Caminhão ${index + 1}: Erro ao calcular rota`);
    }
  };
  
  const iniciarSimulacaoCaminhao = (index) => {
    const rota = rotas[index];
    if (rota.pontosCalculados.length === 0) {
      alert(`Caminhão ${index + 1}: Calcule a rota primeiro`);
      return;
    }
    
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        simulando: true,
        indiceAtual: 0
      };
      return novasRotas;
    });
    
    // Iniciar na primeira posição
    const primeiraPosicao = rota.pontosCalculados[0];
    setPosicoesCaminhoes(prev => {
      const novasPosicoes = [...prev];
      novasPosicoes[index] = primeiraPosicao;
      return novasPosicoes;
    });
    
    // Se tiver caminhão real na API, atualizar
    if (caminhoes[index]) {
      atualizarLocalizacaoAPI(caminhoes[index].id, primeiraPosicao);
    }
    
    // Configurar intervalo de movimentação
    intervalosRef.current[index] = setInterval(() => {
      setRotas(prevRotas => {
        const rotaAtual = prevRotas[index];
        if (rotaAtual.indiceAtual < rotaAtual.pontosCalculados.length - 1) {
          const novoIndice = rotaAtual.indiceAtual + 1;
          const novaPosicao = rotaAtual.pontosCalculados[novoIndice];
          
          // Atualizar posição
          setPosicoesCaminhoes(prevPos => {
            const novasPosicoes = [...prevPos];
            novasPosicoes[index] = novaPosicao;
            return novasPosicoes;
          });
          
          // Atualizar na API se tiver caminhão real
          if (caminhoes[index]) {
            atualizarLocalizacaoAPI(caminhoes[index].id, novaPosicao);
          }
          
          // Atualizar índice
          const novasRotas = [...prevRotas];
          novasRotas[index] = {
            ...rotaAtual,
            indiceAtual: novoIndice
          };
          return novasRotas;
        } else {
          // Chegou ao destino
          pararSimulacaoCaminhao(index);
          return prevRotas;
        }
      });
    }, rota.velocidade);
  };
  
  const pararSimulacaoCaminhao = (index) => {
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        simulando: false
      };
      return novasRotas;
    });
    
    if (intervalosRef.current[index]) {
      clearInterval(intervalosRef.current[index]);
      intervalosRef.current[index] = null;
    }
  };
  
  const pausarSimulacaoCaminhao = (index) => {
    if (intervalosRef.current[index]) {
      clearInterval(intervalosRef.current[index]);
      intervalosRef.current[index] = null;
    }
    
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        simulando: false
      };
      return novasRotas;
    });
  };
  
  const retomarSimulacaoCaminhao = (index) => {
    const rota = rotas[index];
    if (rota.pontosCalculados.length === 0) return;
    
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        simulando: true
      };
      return novasRotas;
    });
    
    intervalosRef.current[index] = setInterval(() => {
      setRotas(prevRotas => {
        const rotaAtual = prevRotas[index];
        if (rotaAtual.indiceAtual < rotaAtual.pontosCalculados.length - 1) {
          const novoIndice = rotaAtual.indiceAtual + 1;
          const novaPosicao = rotaAtual.pontosCalculados[novoIndice];
          
          setPosicoesCaminhoes(prevPos => {
            const novasPosicoes = [...prevPos];
            novasPosicoes[index] = novaPosicao;
            return novasPosicoes;
          });
          
          if (caminhoes[index]) {
            atualizarLocalizacaoAPI(caminhoes[index].id, novaPosicao);
          }
          
          const novasRotas = [...prevRotas];
          novasRotas[index] = {
            ...rotaAtual,
            indiceAtual: novoIndice
          };
          return novasRotas;
        } else {
          pararSimulacaoCaminhao(index);
          return prevRotas;
        }
      });
    }, rota.velocidade);
  };
  
  const limparRotaCaminhao = (index) => {
    pararSimulacaoCaminhao(index);
    
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        pontoA: { lat: null, lng: null },
        pontoB: { lat: null, lng: null },
        pontosCalculados: [],
        indiceAtual: 0
      };
      return novasRotas;
    });
    
    setPosicoesCaminhoes(prev => {
      const novasPosicoes = [...prev];
      novasPosicoes[index] = null;
      return novasPosicoes;
    });
    
    alert(`🧹 Caminhão ${index + 1}: Rota limpa!`);
  };
  
  // --- CONTROLES GLOBAIS ---
  const iniciarTodosCaminhoes = () => {
    rotas.forEach((rota, index) => {
      if (rota.pontosCalculados.length > 0 && !rota.simulando) {
        iniciarSimulacaoCaminhao(index);
      }
    });
  };
  
  const pararTodosCaminhoes = () => {
    rotas.forEach((_, index) => {
      pararSimulacaoCaminhao(index);
    });
  };
  
  const pausarTodosCaminhoes = () => {
    rotas.forEach((_, index) => {
      pausarSimulacaoCaminhao(index);
    });
  };
  
  const calcularTodasRotas = () => {
    rotas.forEach((rota, index) => {
      if (rota.pontoA.lat && rota.pontoB.lat) {
        calcularRotaParaCaminhao(index);
      }
    });
  };
  
  // --- HANDLERS DO MAPA ---
  const handleMapClick = (coordenadas) => {
    const rotaAtual = rotas[caminhaoSelecionado];
    
    if (!rotaAtual.pontoA.lat || !rotaAtual.pontoA.lng) {
      // Definir Ponto A
      setRotas(prev => {
        const novasRotas = [...prev];
        novasRotas[caminhaoSelecionado] = {
          ...novasRotas[caminhaoSelecionado],
          pontoA: coordenadas
        };
        return novasRotas;
      });
    } else if (!rotaAtual.pontoB.lat || !rotaAtual.pontoB.lng) {
      // Definir Ponto B
      setRotas(prev => {
        const novasRotas = [...prev];
        novasRotas[caminhaoSelecionado] = {
          ...novasRotas[caminhaoSelecionado],
          pontoB: coordenadas
        };
        return novasRotas;
      });
    } else {
      // Redefinir Ponto A
      setRotas(prev => {
        const novasRotas = [...prev];
        novasRotas[caminhaoSelecionado] = {
          ...novasRotas[caminhaoSelecionado],
          pontoA: coordenadas,
          pontoB: { lat: null, lng: null },
          pontosCalculados: [],
          simulando: false
        };
        return novasRotas;
      });
      
      setPosicoesCaminhoes(prev => {
        const novasPosicoes = [...prev];
        novasPosicoes[caminhaoSelecionado] = null;
        return novasPosicoes;
      });
    }
  };
  
  const atualizarVelocidadeCaminhao = (index, novaVelocidade) => {
    setRotas(prev => {
      const novasRotas = [...prev];
      novasRotas[index] = {
        ...novasRotas[index],
        velocidade: novaVelocidade
      };
      return novasRotas;
    });
    
    // Se estiver simulando, reiniciar com nova velocidade
    if (rotas[index].simulando) {
      pausarSimulacaoCaminhao(index);
      setTimeout(() => retomarSimulacaoCaminhao(index), 100);
    }
  };
  
  // --- PREPARAR DADOS PARA O MAPA ---
  
  // Preparar dados para o MapaADM
  const pontosMapaADM = posicoesCaminhoes
    .map((posicao, index) => posicao ? {
      id: index,
      placa: caminhoes[index]?.placa || `C${index + 1}`,
      modelo: caminhoes[index]?.modelo || `Modelo ${index + 1}`,
      statusCaminhao: rotas[index]?.simulando ? "EM_VIAGEM" : "ATIVO",
      coordenadas: {
        latitude: posicao.lat,
        longitude: posicao.lng
      },
      cor: rotas[index]?.cor || CORES_CAMINHOES[index % CORES_CAMINHOES.length]
    } : null)
    .filter(Boolean);
  
  // --- CONTEÚDO DIREITA (MAPA) ---
  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Overlay de Status */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "90%",
        maxWidth: "600px"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textAlign: "center",
          border: "2px solid #007bff"
        }}>
          <strong>🚛 Simulação Multi-Caminhões</strong>
          <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "4px" }}>
            {rotas.filter(r => r.simulando).length} ativos • 
            {rotas.filter(r => r.pontosCalculados.length > 0).length} com rota
          </div>
        </div>
        
        {/* Status do caminhão selecionado */}
        {rotas[caminhaoSelecionado] && (
          <div style={{ 
            backgroundColor: rotas[caminhaoSelecionado].cor,
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textAlign: "center"
          }}>
            <strong>Caminhão {caminhaoSelecionado + 1}</strong>
            <div>
              {rotas[caminhaoSelecionado].simulando ? "▶️ Em movimento" : "⏸️ Parado"} • 
              Ponto {rotas[caminhaoSelecionado].indiceAtual + 1} de {rotas[caminhaoSelecionado].pontosCalculados.length}
            </div>
          </div>
        )}
      </div>

      {/* Mapa principal com MapaADM */}
      <MapaADM
        pontos={pontosMapaADM}
        onMapClick={handleMapClick}
        mode="CAMINHAO"
        containerHeight="100%"
        containerWidth="100%"
      />

      {/* Instrução para o caminhão selecionado */}
      {rotas[caminhaoSelecionado] && (
        <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 999 }}>
          {!rotas[caminhaoSelecionado].pontoA.lat ? (
            <div style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              maxWidth: "300px"
            }}>
              💡 <strong>Clique no mapa</strong> para definir o Ponto A do Caminhão {caminhaoSelecionado + 1}
            </div>
          ) : !rotas[caminhaoSelecionado].pontoB.lat ? (
            <div style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              maxWidth: "300px"
            }}>
              ✅ Ponto A definido! <strong>Clique para definir Ponto B</strong>
            </div>
          ) : rotas[caminhaoSelecionado].pontosCalculados.length === 0 ? (
            <div style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              maxWidth: "300px"
            }}>
              ✅ Pontos A e B definidos! <strong>Clique em "Calcular Rota"</strong>
            </div>
          ) : null}
        </div>
      )}

      {/* Legenda das rotas */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 999,
        maxWidth: "200px"
      }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
          🚚 Caminhões Ativos
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {pontosMapaADM.slice(0, 5).map((cam, idx) => (
            <div key={idx} style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "4px 8px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.03)"
            }}>
              <div style={{ 
                width: "12px", 
                height: "12px", 
                borderRadius: "50%", 
                backgroundColor: cam.cor 
              }}></div>
              <span style={{ flex: 1, fontSize: "0.85rem" }}>{cam.placa}</span>
              <span style={{ fontSize: "0.8rem" }}>{cam.statusCaminhao === "EM_VIAGEM" ? "▶️" : "⏸️"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout title="Simulação Multi-Caminhões" rightContent={RightSideContent}>
      {/* --- LADO ESQUERDO: CONTROLES --- */}
      
      {/* Tabela de Caminhões */}
      <div style={{ 
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        boxSizing: "border-box"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          paddingBottom: "10px",
          borderBottom: "2px solid #e9ecef"
        }}>
          <h3 style={{ margin: 0, color: "#036b1a", fontSize: "1.1rem" }}>Tabela de Controle (10 Caminhões)</h3>
          <button 
            onClick={carregarCaminhoes} 
            style={{
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              transition: "background 0.3s"
            }}
            disabled={loading}
          >
            {loading ? "🔄" : "↻"}
          </button>
        </div>
        
        <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "6px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "2px solid #dee2e6", color: "#495057", fontWeight: "600" }}>#</th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "2px solid #dee2e6", color: "#495057", fontWeight: "600" }}>Placa</th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "2px solid #dee2e6", color: "#495057", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "2px solid #dee2e6", color: "#495057", fontWeight: "600" }}>Rota</th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "2px solid #dee2e6", color: "#495057", fontWeight: "600" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px !important", color: "#6c757d", fontStyle: "italic" }}>
                    Carregando caminhões...
                  </td>
                </tr>
              ) : (
                rotas.map((rota, index) => {
                  const caminhao = caminhoes[index] || { placa: `C${index + 1}`, modelo: "Simulado" };
                  return (
                    <tr 
                      key={index} 
                      style={{ 
                        cursor: "pointer",
                        transition: "background 0.2s",
                        backgroundColor: caminhaoSelecionado === index ? "#e8f4ff" : "transparent",
                        borderLeft: caminhaoSelecionado === index ? "3px solid #007bff" : "none"
                      }}
                      onClick={() => setCaminhaoSelecionado(index)}
                    >
                      <td style={{ padding: "10px" }}>
                        <div style={{ 
                          width: "30px", 
                          height: "30px", 
                          borderRadius: "50%", 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          backgroundColor: rota.cor,
                          color: "white"
                        }}>
                          {index + 1}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <strong>{caminhao.placa}</strong>
                        <br />
                        <small>{caminhao.modelo}</small>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          marginBottom: "5px",
                          backgroundColor: rota.simulando ? "#d4edda" : "#f8d7da",
                          color: rota.simulando ? "#155724" : "#721c24"
                        }}>
                          {rota.simulando ? "▶️ EM MOVIMENTO" : "⏸️ PARADO"}
                        </span>
                        <div style={{ marginTop: "5px" }}>
                          {rota.pontosCalculados.length > 0 ? (
                            <>
                              <div style={{ 
                                width: "100%", 
                                height: "4px", 
                                backgroundColor: "#e9ecef", 
                                borderRadius: "2px", 
                                overflow: "hidden",
                                marginBottom: "3px"
                              }}>
                                <div 
                                  style={{ 
                                    height: "100%",
                                    width: `${(rota.indiceAtual / rota.pontosCalculados.length) * 100}%`,
                                    backgroundColor: rota.cor,
                                    transition: "width 0.3s"
                                  }}
                                ></div>
                              </div>
                              <small>{rota.indiceAtual}/{rota.pontosCalculados.length} pontos</small>
                            </>
                          ) : (
                            <small>Sem rota</small>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          {rota.pontoA.lat ? (
                            <small>✅ Ponto A</small>
                          ) : (
                            <small>❌ Sem A</small>
                          )}
                          {rota.pontoB.lat ? (
                            <small>✅ Ponto B</small>
                          ) : (
                            <small>❌ Sem B</small>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          {!rota.simulando ? (
                            <button 
                              style={{
                                width: "32px",
                                height: "32px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: (!rota.pontoA.lat || !rota.pontoB.lat) ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.9rem",
                                transition: "all 0.2s",
                                backgroundColor: "#28a745",
                                color: "white",
                                opacity: (!rota.pontoA.lat || !rota.pontoB.lat) ? 0.5 : 1
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rota.pontosCalculados.length > 0) {
                                  iniciarSimulacaoCaminhao(index);
                                } else {
                                  calcularRotaParaCaminhao(index);
                                }
                              }}
                              disabled={!rota.pontoA.lat || !rota.pontoB.lat}
                            >
                              {rota.pontosCalculados.length > 0 ? "▶️" : "🗺️"}
                            </button>
                          ) : (
                            <button 
                              style={{
                                width: "32px",
                                height: "32px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.9rem",
                                transition: "all 0.2s",
                                backgroundColor: "#ffc107",
                                color: "black"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                pausarSimulacaoCaminhao(index);
                              }}
                            >
                              ⏸️
                            </button>
                          )}
                          
                          <button 
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "none",
                              borderRadius: "6px",
                              cursor: (!rota.simulando && rota.indiceAtual === 0) ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.9rem",
                              transition: "all 0.2s",
                              backgroundColor: "#dc3545",
                              color: "white",
                              opacity: (!rota.simulando && rota.indiceAtual === 0) ? 0.5 : 1
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              pararSimulacaoCaminhao(index);
                            }}
                            disabled={!rota.simulando && rota.indiceAtual === 0}
                          >
                            ⏹️
                          </button>
                          
                          <button 
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.9rem",
                              transition: "all 0.2s",
                              backgroundColor: "#6c757d",
                              color: "white"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              limparRotaCaminhao(index);
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controles do Caminhão Selecionado */}
      <div style={{ 
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ margin: "0 0 15px 0", color: "#007bff", textAlign: "center", paddingBottom: "8px", borderBottom: "1px solid #e9ecef" }}>
          Controle do Caminhão {caminhaoSelecionado + 1}
        </h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", fontSize: "0.85rem", marginBottom: "5px", color: "#495057" }}>Ponto A (Origem)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={rotas[caminhaoSelecionado]?.pontoA.lat || ""}
                onChange={(e) => setRotas(prev => {
                  const novasRotas = [...prev];
                  novasRotas[caminhaoSelecionado] = {
                    ...novasRotas[caminhaoSelecionado],
                    pontoA: { ...novasRotas[caminhaoSelecionado].pontoA, lat: e.target.value }
                  };
                  return novasRotas;
                })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  boxSizing: "border-box"
                }}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={rotas[caminhaoSelecionado]?.pontoA.lng || ""}
                onChange={(e) => setRotas(prev => {
                  const novasRotas = [...prev];
                  novasRotas[caminhaoSelecionado] = {
                    ...novasRotas[caminhaoSelecionado],
                    pontoA: { ...novasRotas[caminhaoSelecionado].pontoA, lng: e.target.value }
                  };
                  return novasRotas;
                })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", fontSize: "0.85rem", marginBottom: "5px", color: "#495057" }}>Ponto B (Destino)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={rotas[caminhaoSelecionado]?.pontoB.lat || ""}
                onChange={(e) => setRotas(prev => {
                  const novasRotas = [...prev];
                  novasRotas[caminhaoSelecionado] = {
                    ...novasRotas[caminhaoSelecionado],
                    pontoB: { ...novasRotas[caminhaoSelecionado].pontoB, lat: e.target.value }
                  };
                  return novasRotas;
                })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  boxSizing: "border-box"
                }}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={rotas[caminhaoSelecionado]?.pontoB.lng || ""}
                onChange={(e) => setRotas(prev => {
                  const novasRotas = [...prev];
                  novasRotas[caminhaoSelecionado] = {
                    ...novasRotas[caminhaoSelecionado],
                    pontoB: { ...novasRotas[caminhaoSelecionado].pontoB, lng: e.target.value }
                  };
                  return novasRotas;
                })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "5px", color: "#495057" }}>
            Velocidade: {rotas[caminhaoSelecionado]?.velocidade}ms
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={rotas[caminhaoSelecionado]?.velocidade || 1000}
            onChange={(e) => atualizarVelocidadeCaminhao(caminhaoSelecionado, parseInt(e.target.value))}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <small style={{ display: "block", textAlign: "center", color: "#6c757d", fontSize: "0.8rem" }}>
            Menor valor = Mais rápido
          </small>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          <button
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "white",
              cursor: (!rotas[caminhaoSelecionado]?.pontoA.lat || !rotas[caminhaoSelecionado]?.pontoB.lat) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              backgroundColor: "#00695c",
              opacity: (!rotas[caminhaoSelecionado]?.pontoA.lat || !rotas[caminhaoSelecionado]?.pontoB.lat) ? 0.5 : 1
            }}
            onClick={() => calcularRotaParaCaminhao(caminhaoSelecionado)}
            disabled={!rotas[caminhaoSelecionado]?.pontoA.lat || !rotas[caminhaoSelecionado]?.pontoB.lat}
          >
            🗺️ Calcular Rota
          </button>
          
          {rotas[caminhaoSelecionado]?.simulando ? (
            <button
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                backgroundColor: "#ffc107",
                color: "#212529"
              }}
              onClick={() => pausarSimulacaoCaminhao(caminhaoSelecionado)}
            >
              ⏸️ Pausar
            </button>
          ) : (
            <button
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                color: "white",
                cursor: rotas[caminhaoSelecionado]?.pontosCalculados.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                backgroundColor: "#28a745",
                opacity: rotas[caminhaoSelecionado]?.pontosCalculados.length === 0 ? 0.5 : 1
              }}
              onClick={() => iniciarSimulacaoCaminhao(caminhaoSelecionado)}
              disabled={rotas[caminhaoSelecionado]?.pontosCalculados.length === 0}
            >
              ▶️ Iniciar
            </button>
          )}
          
          <button
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              backgroundColor: "#dc3545"
            }}
            onClick={() => limparRotaCaminhao(caminhaoSelecionado)}
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      {/* Controles Globais */}
      <div style={{ 
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ margin: "0 0 15px 0", color: "#036b1a", textAlign: "center", paddingBottom: "8px", borderBottom: "1px solid #e9ecef" }}>
          Controles Globais
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button 
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#00695c"
            }}
            onClick={calcularTodasRotas}
          >
            🗺️ Calcular Todas
          </button>
          <button 
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#28a745"
            }}
            onClick={iniciarTodosCaminhoes}
          >
            ▶️ Iniciar Todos
          </button>
          <button 
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "#212529",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#ffc107"
            }}
            onClick={pausarTodosCaminhoes}
          >
            ⏸️ Pausar Todos
          </button>
          <button 
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#dc3545"
            }}
            onClick={pararTodosCaminhoes}
          >
            ⏹️ Parar Todos
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div style={{ 
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        border: "1px solid #c8e6c9"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>💡 Instruções</h4>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#555", fontSize: "0.9rem" }}>
          <li style={{ marginBottom: "5px" }}>Selecione um caminhão na tabela</li>
          <li style={{ marginBottom: "5px" }}>Defina Ponto A e B (digitando ou clicando no mapa)</li>
          <li style={{ marginBottom: "5px" }}>Calcule a rota para o caminhão selecionado</li>
          <li style={{ marginBottom: "5px" }}>Inicie a simulação individual ou use controles globais</li>
          <li>Clique em outro caminhão para configurar rota diferente</li>
        </ol>
        <p style={{ 
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px dashed #a5d6a7",
          fontSize: "0.85rem",
          color: "#2e7d32",
          fontStyle: "italic"
        }}>
          <strong>Dica:</strong> Cada caminhão tem cor única e ícone próprio no mapa
        </p>
      </div>
    </ScreenLayout>
  );
}

export default PageSimulacaoMulti;
