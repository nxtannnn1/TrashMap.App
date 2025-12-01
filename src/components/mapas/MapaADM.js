/* global google */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

// --- IMPORTANTE: Definir estas constantes FORA do componente ---
const DEFAULT_CENTER = { lat: -12.9777, lng: -38.5016 };
const DEFAULT_ZOOM = 12;

// ADICIONEI 'geometry' AQUI PARA IGUALAR AO OUTRO MAPA E EVITAR O ERRO
const LIBRARIES = ['places', 'geometry']; 

const MAP_ID = 'f920ced75bc6f2eee7969c92'; 

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

const MapaADM = ({ pontos = [], onMapClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script', // Vamos usar este ID como padrão
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "", 
    libraries: LIBRARIES, // Usa a constante definida fora
  });

  const [map, setMap] = useState(null);
  const [rotas, setRotas] = useState({});
  
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div style={{padding:'20px'}}>Carregando Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapId={MAP_ID}
      options={{
        gestureHandling: 'greedy',
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      onClick={(e) =>
        onMapClick && onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
    >
      {pontos.map((ponto, index) => {
         const lat = parseFloat(ponto.coordenadas?.latitude || ponto.latitude || ponto.endereco?.coordenadas?.latitude);
         const lng = parseFloat(ponto.coordenadas?.longitude || ponto.longitude || ponto.endereco?.coordenadas?.longitude);

         if(isNaN(lat) || isNaN(lng)) return null;

         return (
            <Marker
                key={ponto.id || index}
                position={{ lat, lng }}
                title={ponto.nome}
            />
         )
      })}

      {Object.entries(rotas).map(([id, rota]) => (
        <Polyline
          key={id}
          path={rota}
          options={{ strokeColor: '#1E90FF', strokeWeight: 3, strokeOpacity: 0.8 }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapaADM;