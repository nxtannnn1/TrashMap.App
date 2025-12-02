/* global google */
import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const SENAI_LOCATION = { 
  lat: -12.9326, 
  lng: -38.5067 
};

const DEFAULT_ZOOM = 15;
const LIBRARIES = ['places', 'geometry'];

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

const MapaADM = ({ 
  pontos = [], 
  onMapClick, 
  mode = "COLETA",
  containerHeight = "100%",
  containerWidth = "100%"
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "", 
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState(null);
  const [newPoint, setNewPoint] = useState(null);

  const dynamicContainerStyle = {
    ...containerStyle,
    height: containerHeight,
    width: containerWidth
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (e) => {
    const clickedLocation = { 
      lat: e.latLng.lat(), 
      lng: e.latLng.lng() 
    };
    
    setNewPoint({
      position: clickedLocation,
      title: mode === "CAMINHAO" ? "Novo Caminhão" : "Novo Ponto de Coleta"
    });
    
    if (onMapClick) {
      onMapClick(clickedLocation);
    }
  };

  // Centralizar no SENAI
  const centerOnSenai = () => {
    if (map) {
      map.panTo(SENAI_LOCATION);
      map.setZoom(17);
    }
  };

  // ÍCONES FIXOS
  const getTrashIcon = () => ({
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="17" fill="#0A3B1A" stroke="white" stroke-width="2"/>
        <g transform="translate(8, 8)" fill="white">
          <path d="M5 16V6H1V4H7V16H5Z"/>
          <path d="M16 16V6H10V4H18V16H16Z"/>
          <rect x="3" y="7" width="14" height="2"/>
          <rect x="5" y="11" width="10" height="2"/>
          <rect x="7" y="15" width="6" height="2"/>
        </g>
        <circle cx="18" cy="18" r="5" fill="transparent" stroke="#4CAF50" stroke-width="1.5"/>
        <path d="M15,16 L18,13 L21,16" stroke="#4CAF50" stroke-width="1.5" fill="none"/>
        <path d="M21,20 L18,23 L15,20" stroke="#4CAF50" stroke-width="1.5" fill="none"/>
      </svg>
    `),
    scaledSize: { width: 36, height: 36 },
    anchor: { x: 18, y: 18 },
  });

  const getTruckIcon = (status = "ATIVO") => {
    let fillColor;
    switch(status?.toUpperCase()) {
      case 'ATIVO': fillColor = '#28a745'; break;
      case 'EM_MANUTENCAO': 
      case 'EM_MANUTENCÃO': fillColor = '#ffc107'; break;
      case 'INATIVO': fillColor = '#dc3545'; break;
      case 'EM_VIAGEM': fillColor = '#17a2b8'; break;
      default: fillColor = '#007bff';
    }

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="20" fill="${fillColor}" stroke="white" stroke-width="2"/>
          <g transform="translate(8, 10)" fill="white">
            <rect x="2" y="8" width="18" height="8" rx="1"/>
            <rect x="20" y="10" width="8" height="6" rx="1"/>
            <circle cx="6" cy="22" r="3" fill="#333"/>
            <circle cx="24" cy="22" r="3" fill="#333"/>
            <rect x="21" y="11" width="6" height="3" fill="#87CEEB"/>
          </g>
          <text x="21" y="35" text-anchor="middle" font-size="8" font-weight="bold" fill="white">🚚</text>
        </svg>
      `),
      scaledSize: { width: 42, height: 42 },
      anchor: { x: 21, y: 21 },
    };
  };

  // Função para determinar qual ícone usar
  const getIconForPoint = (ponto) => {
    if (mode === "CAMINHAO") {
      return getTruckIcon(ponto.status || ponto.statusCaminhao);
    }
    return getTrashIcon();
  };

  // Ícone do usuário (localização padrão SENAI)
  const getSenaiIcon = () => {
    if (!window.google) return null;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "#FFFFFF",
      scale: 6,
    };
  };

  if (loadError) {
    return (
      <div style={{
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        height: containerHeight,
        width: containerWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c62828'
      }}>
        <div>
          <div style={{ marginBottom: '10px', fontSize: '16px' }}>⚠️ Erro ao carregar mapa</div>
          <div style={{ fontSize: '0.9rem' }}>Verifique sua conexão</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        height: containerHeight,
        width: containerWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ marginBottom: '10px', fontSize: '14px' }}>
            {mode === "CAMINHAO" ? "🚚 Carregando..." : "🗑️ Carregando..."}
          </div>
          <div style={{ width: '24px', height: '24px', margin: '10px auto',
            border: '3px solid #ccc', borderTop: '3px solid #007bff',
            borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const senaiIcon = getSenaiIcon();

  return (
    <div style={{ 
      position: 'relative', 
      width: containerWidth, 
      height: containerHeight 
    }}>
      <GoogleMap
        mapContainerStyle={dynamicContainerStyle}
        center={SENAI_LOCATION}
        zoom={DEFAULT_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          gestureHandling: 'greedy',
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {/* Marcador da localização padrão SENAI */}
        {senaiIcon && (
          <Marker
            position={SENAI_LOCATION}
            title="SENAI Dendezeiros"
            icon={senaiIcon}
            zIndex={1000}
          />
        )}

        {/* Pontos existentes */}
        {pontos.map((ponto, index) => {
          const lat = parseFloat(
            ponto.coordenadas?.latitude || 
            ponto.latitude || 
            ponto.endereco?.coordenadas?.latitude
          );
          
          const lng = parseFloat(
            ponto.coordenadas?.longitude || 
            ponto.longitude || 
            ponto.endereco?.coordenadas?.longitude
          );

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={ponto.id || index}
              position={{ lat, lng }}
              title={ponto.nome || ponto.placa || `Ponto ${index + 1}`}
              icon={getIconForPoint(ponto)}
              zIndex={10}
            />
          );
        })}

        {/* Preview do novo ponto */}
        {newPoint && (
          <Marker
            position={newPoint.position}
            title={newPoint.title}
            icon={mode === "CAMINHAO" ? getTruckIcon("ATIVO") : getTrashIcon()}
            zIndex={100}
            animation={window.google?.maps?.Animation?.BOUNCE}
          />
        )}
      </GoogleMap>

      {/* Controles */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000
      }}>
        <button
          onClick={centerOnSenai}
          style={{
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
          title="Centralizar no SENAI"
        >
          📍
        </button>

        {newPoint && (
          <button
            onClick={() => setNewPoint(null)}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
            title="Remover seleção"
          >
            ✕
          </button>
        )}
      </div>

      {/* Legenda */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '11px',
        zIndex: 1000,
        maxWidth: '180px',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{mode === "CAMINHAO" ? '🚚' : '🗑️'}</span>
          <span>{mode === "CAMINHAO" ? 'Caminhões' : 'Pontos'}</span>
        </div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          Clique no mapa para adicionar
        </div>
        <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '4px', fontStyle: 'italic' }}>
          📍 SENAI: -12.9326, -38.5067
        </div>
      </div>
    </div>
  );
};

export default MapaADM;