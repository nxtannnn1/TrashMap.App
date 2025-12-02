import React, { useState, useEffect, useRef } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";  // Ajuste se necessário
import MapaSimulacao from "../mapas/MapaSimulacao";  // Ajuste se necessário
import MapaADM from "../mapas/MapaADM";  // Ajuste se necessário
import { API_BASE_URL } from "../../../config/api";  // Ajuste se necessário
import "./SimulacaoMultiCaminhao.css";  // CSS local
function SimulacaoMultiCaminhao() {
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
  const [rotas, setRotas] = useState(Array(TOTAL_CAMINHOES).fill(null).map(() => ({
    pontoA: { lat: null, lng: null },
    pontoB: { lat: null, lng: null },
    pontosCalculados: [],
    indiceAtual: 0,
    simulando: false,
    velocidade: 1000,
    cor: CORES_CAMINHOES[0]
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
  
  // Atualizar cores ao carregar caminhões
  useEffect(() => {
    if (caminhoes.length > 0) {
      setRotas(prev => prev.map((rota, index) => ({
        ...rota,
        cor: CORES_CAMINHOES[index % CORES_CAMINHOES.length]
      })));
    }
  }, [caminhoes]);
  
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
  const pontosRotaMapa = rotas[caminhaoSelecionado]?.pontosCalculados || [];
  
  // Preparar todos os caminhões para exibição no mapa
  const todosCaminhoesMapa = posicoesCaminhoes
    .map((posicao, index) => ({
      id: index,
      placa: caminhoes[index]?.placa || `C${index + 1}`,
      coordenadas: posicao ? { latitude: posicao.lat, longitude: posicao.lng } : null,
      cor: rotas[index]?.cor || "#000000",
      simulando: rotas[index]?.simulando || false
    }))
    .filter(cam => cam.coordenadas !== null);
  
  // --- CONTEÚDO DIREITA (MAPA) ---
  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Overlay de Status */}
      <div className="status-multi-overlay">
        <div className="status-global">
          <strong>🚛 Simulação Multi-Caminhões</strong>
          <div className="status-stats">
            {rotas.filter(r => r.simulando).length} ativos • 
            {rotas.filter(r => r.pontosCalculados.length > 0).length} com rota
          </div>
        </div>
        
        {/* Status do caminhão selecionado */}
        {rotas[caminhaoSelecionado] && (
          <div className="status-selected" style={{ 
            backgroundColor: rotas[caminhaoSelecionado].cor,
            color: "white"
          }}>
            <strong>Caminhão {caminhaoSelecionado + 1}</strong>
            <div>
              {rotas[caminhaoSelecionado].simulando ? "▶️ Em movimento" : "⏸️ Parado"} • 
              Ponto {rotas[caminhaoSelecionado].indiceAtual + 1} de {rotas[caminhaoSelecionado].pontosCalculados.length}
            </div>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <MapaSimulacao
        onMapClick={handleMapClick}
        pontoA={rotas[caminhaoSelecionado]?.pontoA || null}
        pontoB={rotas[caminhaoSelecionado]?.pontoB || null}
        pontosRota={pontosRotaMapa}
        posicaoCaminhao={posicoesCaminhoes[caminhaoSelecionado]}
        pontosDeColeta={todosCaminhoesMapa.map(cam => ({
          id: cam.id,
          nome: cam.placa,
          coordenadas: cam.coordenadas
        }))}
      />

      {/* Legenda dos caminhões */}
      <div className="legend-container">
        <div className="legend-title">🚚 Caminhões Ativos</div>
        <div className="legend-items">
          {todosCaminhoesMapa.slice(0, 5).map((cam, idx) => (
            <div key={idx} className="legend-item" style={{ borderLeftColor: cam.cor }}>
              <div className="legend-color" style={{ backgroundColor: cam.cor }}></div>
              <span className="legend-text">{cam.placa}</span>
              <span className="legend-status">{cam.simulando ? "▶️" : "⏸️"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instrução para o caminhão selecionado */}
      {rotas[caminhaoSelecionado] && (
        <div className="map-instruction">
          {!rotas[caminhaoSelecionado].pontoA.lat ? (
            <div className="instruction-box">
              💡 <strong>Clique no mapa</strong> para definir o Ponto A do Caminhão {caminhaoSelecionado + 1}
            </div>
          ) : !rotas[caminhaoSelecionado].pontoB.lat ? (
            <div className="instruction-box">
              ✅ Ponto A definido! <strong>Clique para definir Ponto B</strong>
            </div>
          ) : rotas[caminhaoSelecionado].pontosCalculados.length === 0 ? (
            <div className="instruction-box">
              ✅ Pontos A e B definidos! <strong>Clique em "Calcular Rota"</strong>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <ScreenLayout title="Simulação Multi-Caminhões" rightContent={RightSideContent}>
      {/* --- LADO ESQUERDO: CONTROLES --- */}
      
      {/* Tabela de Caminhões */}
      <div className="table-container-multi">
        <div className="table-header">
          <h3>Tabela de Controle (10 Caminhões)</h3>
          <button onClick={carregarCaminhoes} className="btn-refresh" disabled={loading}>
            {loading ? "🔄" : "↻"}
          </button>
        </div>
        
        <div className="table-wrapper-scroll">
          <table className="table-multi">
            <thead>
              <tr>
                <th>#</th>
                <th>Placa</th>
                <th>Status</th>
                <th>Rota</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading-row">
                    Carregando caminhões...
                  </td>
                </tr>
              ) : (
                rotas.map((rota, index) => {
                  const caminhao = caminhoes[index] || { placa: `C${index + 1}`, modelo: "Simulado" };
                  return (
                    <tr 
                      key={index} 
                      className={`table-row ${caminhaoSelecionado === index ? 'selected' : ''}`}
                      onClick={() => setCaminhaoSelecionado(index)}
                    >
                      <td className="caminhao-number" style={{ backgroundColor: rota.cor, color: "white" }}>
                        {index + 1}
                      </td>
                      <td>
                        <strong>{caminhao.placa}</strong>
                        <br />
                        <small>{caminhao.modelo}</small>
                      </td>
                      <td>
                        <span className={`status-badge ${rota.simulando ? 'active' : 'inactive'}`}>
                          {rota.simulando ? "▶️ EM MOVIMENTO" : "⏸️ PARADO"}
                        </span>
                        <div className="progress-info">
                          {rota.pontosCalculados.length > 0 ? (
                            <>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ 
                                    width: `${(rota.indiceAtual / rota.pontosCalculados.length) * 100}%`,
                                    backgroundColor: rota.cor
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
                      <td>
                        <div className="rota-info">
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
                      <td>
                        <div className="action-buttons">
                          {!rota.simulando ? (
                            <button 
                              className="btn-action-small btn-start"
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
                              className="btn-action-small btn-pause"
                              onClick={(e) => {
                                e.stopPropagation();
                                pausarSimulacaoCaminhao(index);
                              }}
                            >
                              ⏸️
                            </button>
                          )}
                          
                          <button 
                            className="btn-action-small btn-stop"
                            onClick={(e) => {
                              e.stopPropagation();
                              pararSimulacaoCaminhao(index);
                            }}
                            disabled={!rota.simulando && rota.indiceAtual === 0}
                          >
                            ⏹️
                          </button>
                          
                          <button 
                            className="btn-action-small btn-clear"
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
      <div className="selected-controls">
        <h4>Controle do Caminhão {caminhaoSelecionado + 1}</h4>
        
        <div className="coord-controls">
          <div className="coord-group">
            <label>Ponto A (Origem)</label>
            <div className="coord-inputs">
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
              />
            </div>
          </div>
          
          <div className="coord-group">
            <label>Ponto B (Destino)</label>
            <div className="coord-inputs">
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
              />
            </div>
          </div>
        </div>
        
        <div className="velocity-control">
          <label>Velocidade: {rotas[caminhaoSelecionado]?.velocidade}ms</label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={rotas[caminhaoSelecionado]?.velocidade || 1000}
            onChange={(e) => atualizarVelocidadeCaminhao(caminhaoSelecionado, parseInt(e.target.value))}
          />
          <small>Menor valor = Mais rápido</small>
        </div>
        
        <div className="selected-actions">
          <button
            className="btn-calculate"
            onClick={() => calcularRotaParaCaminhao(caminhaoSelecionado)}
            disabled={!rotas[caminhaoSelecionado]?.pontoA.lat || !rotas[caminhaoSelecionado]?.pontoB.lat}
          >
            🗺️ Calcular Rota
          </button>
          
          {rotas[caminhaoSelecionado]?.simulando ? (
            <button
              className="btn-pause-main"
              onClick={() => pausarSimulacaoCaminhao(caminhaoSelecionado)}
            >
              ⏸️ Pausar
            </button>
          ) : (
            <button
              className="btn-start-main"
              onClick={() => iniciarSimulacaoCaminhao(caminhaoSelecionado)}
              disabled={rotas[caminhaoSelecionado]?.pontosCalculados.length === 0}
            >
              ▶️ Iniciar
            </button>
          )}
          
          <button
            className="btn-clear-main"
            onClick={() => limparRotaCaminhao(caminhaoSelecionado)}
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      {/* Controles Globais */}
      <div className="global-controls">
        <h4>Controles Globais</h4>
        <div className="global-buttons">
          <button className="btn-global btn-calc-all" onClick={calcularTodasRotas}>
            🗺️ Calcular Todas
          </button>
          <button className="btn-global btn-start-all" onClick={iniciarTodosCaminhoes}>
            ▶️ Iniciar Todos
          </button>
          <button className="btn-global btn-pause-all" onClick={pausarTodosCaminhoes}>
            ⏸️ Pausar Todos
          </button>
          <button className="btn-global btn-stop-all" onClick={pararTodosCaminhoes}>
            ⏹️ Parar Todos
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="instructions-panel">
        <h4>💡 Instruções</h4>
        <ol>
          <li>Selecione um caminhão na tabela</li>
          <li>Defina Ponto A e B (digitando ou clicando no mapa)</li>
          <li>Calcule a rota para o caminhão selecionado</li>
          <li>Inicie a simulação individual ou use controles globais</li>
          <li>Clique em outro caminhão para configurar rota diferente</li>
        </ol>
        <p className="hint">
          <strong>Dica:</strong> Cada caminhão tem cor única no mapa
        </p>
      </div>

    </ScreenLayout>
  );
}   