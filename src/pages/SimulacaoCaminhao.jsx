// src/pages/SimulacaoCaminhao.jsx
import React, { useState, useRef, useEffect } from 'react';
import MapaSimulacao from '../components/MapaSimulacao';
import API_BASE_URL from '../config/api';

const SimulacaoCaminhao = () => {
  const [pontoA, setPontoA] = useState({ lat: '', lng: '' });
  const [pontoB, setPontoB] = useState({ lat: '', lng: '' });
  const [velocidade, setVelocidade] = useState(1000);
  const [simulando, setSimulando] = useState(false);
  const [pontosIntermediarios, setPontosIntermediarios] = useState([]);
  const [caminhaoId, setCaminhaoId] = useState('1');
  const [posicaoCaminhao, setPosicaoCaminhao] = useState(null); // ← ADICIONAR ESTE STATE
  const intervaloRef = useRef(null);
  const pontosCalculadosRef = useRef([]);
  const indiceAtualRef = useRef(0);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Debug da API
  useEffect(() => {
    console.log('🔍 Debug - API Google Maps:', {
      apiLoaded,
      google: !!window.google,
      googleMaps: window.google?.maps
    });
  }, [apiLoaded]);

  // Verificar se a API do Google Maps está carregada
  useEffect(() => {
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

  const calcularRota = async () => {
    if (!pontoA.lat || !pontoA.lng || !pontoB.lat || !pontoB.lng) {
      alert('Preencha ambos os pontos A e B');
      return;
    }

    if (!apiLoaded) {
      alert('Aguarde a API do Google Maps carregar');
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: new window.google.maps.LatLng(parseFloat(pontoA.lat), parseFloat(pontoA.lng)),
            destination: new window.google.maps.LatLng(parseFloat(pontoB.lat), parseFloat(pontoB.lng)),
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(new Error(`Erro ao calcular rota: ${status}`));
            }
          }
        );
      });

      const path = result.routes[0].overview_path;
      const pontos = path.map(point => ({
        lat: point.lat(),
        lng: point.lng()
      }));

      pontosCalculadosRef.current = pontos;
      setPontosIntermediarios(pontos);
      alert(`Rota calculada com ${pontos.length} pontos`);

    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      alert('Erro ao calcular rota: ' + error.message);
    }
  };

  // Função para enviar posição para o backend
  const enviarPosicao = async (posicao) => {
    try {
      const response = await fetch(`${API_BASE_URL}/caminhoes/${caminhaoId}/localizacao`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: posicao.lat,
          longitude: posicao.lng
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar posição');
      }

      console.log('📍 Posição enviada:', posicao);
    } catch (error) {
      console.error('Erro ao enviar posição:', error);
    }
  };

  const iniciarSimulacao = () => {
    if (pontosCalculadosRef.current.length === 0) {
      alert('Calcule a rota primeiro');
      return;
    }

    setSimulando(true);
    indiceAtualRef.current = 0;

    // Definir primeira posição do caminhão
    const primeiraPosicao = pontosCalculadosRef.current[0];
    setPosicaoCaminhao(primeiraPosicao); // ← ATUALIZAR POSIÇÃO DO CAMINHÃO
    enviarPosicao(primeiraPosicao);

    intervaloRef.current = setInterval(() => {
      if (indiceAtualRef.current < pontosCalculadosRef.current.length - 1) {
        indiceAtualRef.current++;
        const posicaoAtual = pontosCalculadosRef.current[indiceAtualRef.current];
        
        console.log(`🚛 Movendo para ponto ${indiceAtualRef.current + 1} de ${pontosCalculadosRef.current.length}`);
        
        // ATUALIZAR POSIÇÃO DO CAMINHÃO NO MAPA
        setPosicaoCaminhao(posicaoAtual); // ← ATUALIZAR POSIÇÃO DO CAMINHÃO
        enviarPosicao(posicaoAtual);
      } else {
        pararSimulacao();
        alert('🎉 Caminhão chegou ao destino!');
      }
    }, velocidade);
  };

  const pararSimulacao = () => {
    setSimulando(false);
    setPosicaoCaminhao(null); // ← LIMPAR POSIÇÃO DO CAMINHÃO
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const handleMapClick = (coordenadas) => {
    if (!pontoA.lat || !pontoA.lng) {
      setPontoA(coordenadas);
      alert('✅ Ponto A definido! Agora clique no Ponto B');
    } else if (!pontoB.lat || !pontoB.lng) {
      setPontoB(coordenadas);
      alert('✅ Ponto B definido! Clique em "Calcular Rota"');
    } else {
      setPontoA(coordenadas);
      setPontoB({ lat: '', lng: '' });
      setPontosIntermediarios([]);
      pontosCalculadosRef.current = [];
      setPosicaoCaminhao(null); // ← LIMPAR POSIÇÃO DO CAMINHÃO
      alert('🔄 Ponto A redefinido! Clique no Ponto B');
    }
  };

  const limparRota = () => {
    setPontoA({ lat: '', lng: '' });
    setPontoB({ lat: '', lng: '' });
    setPontosIntermediarios([]);
    pontosCalculadosRef.current = [];
    setPosicaoCaminhao(null); // ← LIMPAR POSIÇÃO DO CAMINHÃO
    pararSimulacao();
    alert('🧹 Rota limpa!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎮 Simulação de Movimento do Caminhão</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h3>⚙️ Configuração da Rota</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>ID do Caminhão:</label>
          <input
            type="number"
            value={caminhaoId}
            onChange={(e) => setCaminhaoId(e.target.value)}
            placeholder="1"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <small>Digite o ID do caminhão que você criou</small>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>Ponto A (Latitude):</label>
            <input
              type="number"
              step="any"
              value={pontoA.lat}
              onChange={(e) => setPontoA(prev => ({ ...prev, lat: e.target.value }))}
              placeholder="Ex: -12.9704"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label>Ponto A (Longitude):</label>
            <input
              type="number"
              step="any"
              value={pontoA.lng}
              onChange={(e) => setPontoA(prev => ({ ...prev, lng: e.target.value }))}
              placeholder="Ex: -38.5124"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>Ponto B (Latitude):</label>
            <input
              type="number"
              step="any"
              value={pontoB.lat}
              onChange={(e) => setPontoB(prev => ({ ...prev, lat: e.target.value }))}
              placeholder="Ex: -12.9718"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label>Ponto B (Longitude):</label>
            <input
              type="number"
              step="any"
              value={pontoB.lng}
              onChange={(e) => setPontoB(prev => ({ ...prev, lng: e.target.value }))}
              placeholder="Ex: -38.5016"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Velocidade (ms entre pontos): {velocidade}ms</label>
          <input
            type="range"
            value={velocidade}
            onChange={(e) => setVelocidade(parseInt(e.target.value))}
            min="100"
            max="5000"
            step="100"
            style={{ width: '100%' }}
          />
          <small>Valores menores = movimento mais rápido</small>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={calcularRota}
            disabled={simulando || !apiLoaded}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: (simulando || !apiLoaded) ? 'not-allowed' : 'pointer'
            }}
          >
            🗺️ Calcular Rota
          </button>

          <button 
            onClick={iniciarSimulacao}
            disabled={simulando || pontosIntermediarios.length === 0}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: (simulando || pontosIntermediarios.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            ▶️ Iniciar Simulação
          </button>

          <button 
            onClick={pararSimulacao}
            disabled={!simulando}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: !simulando ? 'not-allowed' : 'pointer'
            }}
          >
            ⏹️ Parar Simulação
          </button>

          <button 
            onClick={limparRota}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Limpar Rota
          </button>
        </div>

        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>💡 Dica:</strong> Clique no mapa para definir os pontos A e B automaticamente
          {!apiLoaded && ' (Aguardando API do Google Maps...)'}
        </p>
      </div>

      {/* Mapa SIMPLES */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <MapaSimulacao 
          onMapClick={handleMapClick}
          pontoA={pontoA}
          pontoB={pontoB}
          pontosRota={pontosIntermediarios}
          posicaoCaminhao={posicaoCaminhao} // ← PASSAR A POSIÇÃO DO CAMINHÃO
        />
      </div>

      {/* Informações da simulação */}
      {simulando && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <strong>🚛 Simulação em andamento:</strong> Ponto {indiceAtualRef.current + 1} de {pontosCalculadosRef.current.length}
          {posicaoCaminhao && (
            <div>
              <strong>📍 Posição atual:</strong> Lat: {posicaoCaminhao.lat.toFixed(6)}, Lng: {posicaoCaminhao.lng.toFixed(6)}
            </div>
          )}
        </div>
      )}

      {pontosIntermediarios.length > 0 && !simulando && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '4px'
        }}>
          <strong>📊 Rota calculada:</strong> {pontosIntermediarios.length} pontos - Pronto para simular!
        </div>
      )}
    </div>
  );
};

export default SimulacaoCaminhao;