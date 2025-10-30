// src/components/MapaADM.jsx

import React from 'react';
// Importamos os componentes necessários para o Mapa e os Marcadores
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// Ponto central padrão para o Brasil (se não houver pontos)
const DEFAULT_CENTER = { lat: -15.7801, lng: -47.9292 }; 
const DEFAULT_ZOOM = 4;

/**
 * Componente que exibe o mapa e os marcadores de pontos de coleta.
 * @param {Array} pontos - Lista de pontos de coleta a serem exibidos.
 * @param {Function} onMapClick - Função de callback chamada ao clicar no mapa.
 */
// 1. ATUALIZAÇÃO: Receber a função onMapClick nas propriedades
const MapaADM = ({ pontos, onMapClick }) => {
    
    // O mapa precisa de um contêiner com tamanho definido!
    const mapContainerStyle = {
        width: '100%',
        height: '600px', 
        margin: '20px 0',
        borderRadius: '8px'
    };

    // Se houver pontos, calculamos o centro para focar no primeiro ponto, 
    // senão usamos o centro padrão do Brasil.
    const center = (pontos && pontos.length > 0) 
        ? { 
            lat: pontos[0].coordenadas.latitude, 
            lng: pontos[0].coordenadas.longitude 
          }
        : DEFAULT_CENTER;
        
    // Ajustamos o zoom se houver um ponto específico para focar
    const zoom = (pontos && pontos.length > 0) ? 12 : DEFAULT_ZOOM;


    return (
        <div style={mapContainerStyle}>
            <Map
                defaultCenter={center} 
                defaultZoom={zoom}
                gestureHandling={'greedy'} 
                
                // 2. NOVIDADE: Adicionar o handler onClick na tag <Map>
                onClick={(e) => {
                    // Verificamos se a função foi passada antes de chamar
                    if (onMapClick && e.detail && e.detail.latLng) {
                        // Chamamos a função onMapClick passando as coordenadas
                        onMapClick(e.detail.latLng); 
                    }
                }}
            >
                {/* Renderiza um marcador para cada ponto na lista */}
                {pontos && pontos.map(ponto => (
                    <AdvancedMarker 
                        key={ponto.id} // Chave única é essencial
                        position={{ 
                            lat: ponto.coordenadas.latitude, 
                            lng: ponto.coordenadas.longitude 
                        }}
                        title={ponto.nome} // Título exibido ao passar o mouse
                    >
                        {/* Componente visual do pino. Você pode customizar a cor! */}
                        <Pin 
                            background={'#4CAF50'} // Cor verde para lixeiras
                            borderColor={'#1B5E20'}
                            glyphColor={'white'}
                        />
                    </AdvancedMarker>
                ))}
            </Map>
        </div>
    );
};

export default MapaADM;