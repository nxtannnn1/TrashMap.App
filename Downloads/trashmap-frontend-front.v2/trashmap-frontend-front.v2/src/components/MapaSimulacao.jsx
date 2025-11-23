// src/components/MapaSimulacao.jsx
import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const MapaSimulacao = ({ 
  onMapClick, 
  pontoA, 
  pontoB, 
  pontosRota = [],
  posicaoCaminhao = null,
  pontosDeColeta = [], // ← ADICIONAR ISSO
  centro = { lat: -12.931, lng: -38.507 }
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={posicaoCaminhao || centro}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={(e) => onMapClick && onMapClick({ 
        lat: e.latLng.lat(), 
        lng: e.latLng.lng() 
      })}
    >
      {/* Marcadores dos PONTOS DE COLETA */}
      {pontosDeColeta.map((ponto) => {
        const coords = ponto.endereco?.coordenadas || ponto.coordenadas;
        if (!coords) return null;
        
        return (
          <Marker
            key={ponto.id}
            position={{ lat: parseFloat(coords.latitude), lng: parseFloat(coords.longitude) }}
            icon={{
              url: '/icons/trash-bin.png', // Seu ícone de lixeira
              scaledSize: new window.google.maps.Size(25, 25),
            }}
            title={`${ponto.nome} - ${ponto.endereco?.cidade}`}
          />
        );
      })}

      {/* Marcador do CAMINHÃO em movimento */}
      {posicaoCaminhao && (
        <Marker
          position={posicaoCaminhao}
          icon={{
            url: '/icons/garbage-truck.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title="Caminhão em Movimento"
        />
      )}

      {/* Marcador Ponto A */}
      {pontoA.lat && pontoA.lng && (
        <Marker
          position={pontoA}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          title="Ponto A"
        />
      )}

      {/* Marcador Ponto B */}
      {pontoB.lat && pontoB.lng && (
        <Marker
          position={pontoB}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          title="Ponto B"
        />
      )}

      {/* Linha da rota */}
      {pontosRota.length > 0 && (
        <Polyline
          path={pontosRota}
          options={{
            strokeColor: '#1E90FF',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapaSimulacao;