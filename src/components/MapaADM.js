/* global google */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import useCaminhoes from '../hooks/useCaminhoes';
import CaminhaoRealtime from '../components/CaminhaoRealtime';

const DEFAULT_CENTER = { lat: -12.931, lng: -38.507 };
const DEFAULT_ZOOM = 14;
const LIBRARIES = ['places'];
const MAP_ID = 'f920ced75bc6f2eee7969c92';
const MAX_POINTS = 20; // quantidade máxima de pontos na Polyline

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
};

const MapaADM = ({ pontos = [], onMapClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const { caminhoes } = useCaminhoes();
  const [map, setMap] = useState(null);
  const [rotas, setRotas] = useState({});
  const [markers, setMarkers] = useState({ caminhoes: [], pontos: [] });
  const [posicaoCaminhaoRealtime, setPosicaoCaminhaoRealtime] = useState(null);
  const mapCenter = useRef(DEFAULT_CENTER);
  const markerRealtimeRef = useRef(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    mapCenter.current = DEFAULT_CENTER;
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMarkers({ caminhoes: [], pontos: [] });
    markerRealtimeRef.current = null;
  }, []);

  const clearMarkers = (arr) => arr.forEach((m) => m.setMap(null));

  // Atualiza marcadores dos caminhões do hook
  useEffect(() => {
    if (!map || !window.google) return;

    clearMarkers(markers.caminhoes);

    const novosMarkers = [];
    const novasRotas = { ...rotas };

    caminhoes.forEach((caminhao) => {
      const coords = caminhao.coordenadas || caminhao.localizacao?.coordenadas;
      if (!coords) return;

      const pos = { lat: parseFloat(coords.latitude), lng: parseFloat(coords.longitude) };

      // Mantém apenas os últimos MAX_POINTS pontos
      novasRotas[caminhao.id] = [...(novasRotas[caminhao.id] || []), pos].slice(-MAX_POINTS);

      const marker = new google.maps.Marker({
        map,
        position: pos,
        icon: { url: '/icons/garbage-truck.png', scaledSize: new google.maps.Size(30, 30) },
        title: `Caminhão ${caminhao.placa || caminhao.id}`,
      });

      novosMarkers.push(marker);
    });

    setRotas(novasRotas);
    setMarkers((prev) => ({ ...prev, caminhoes: novosMarkers }));
  }, [caminhoes, map]);

  // Atualiza marcador do caminhão em tempo real
  useEffect(() => {
    if (!map || !window.google || !posicaoCaminhaoRealtime) return;

    const pos = posicaoCaminhaoRealtime;

    if (!markerRealtimeRef.current) {
      markerRealtimeRef.current = new google.maps.Marker({
        map,
        position: pos,
        icon: { url: '/icons/garbage-truck.png', scaledSize: new google.maps.Size(30, 30) },
        title: 'Caminhão Realtime',
      });
    } else {
      markerRealtimeRef.current.setPosition(pos);
    }

    // Mantém apenas os últimos MAX_POINTS pontos na Polyline
    setRotas((prevRotas) => ({
      ...prevRotas,
      realtime: [...(prevRotas.realtime || []), pos].slice(-MAX_POINTS),
    }));
  }, [posicaoCaminhaoRealtime, map]);

  // Marcadores de pontos de coleta
  useEffect(() => {
    if (!map || !window.google) return;

    clearMarkers(markers.pontos);

    const novosMarkers = pontos
      .map((ponto) => {
        const coords = ponto.endereco?.coordenadas;
        if (!coords) return null;

        return new google.maps.Marker({
          map,
          position: { lat: parseFloat(coords.latitude), lng: parseFloat(coords.longitude) },
          icon: { url: '/icons/trash-bin.png', scaledSize: new google.maps.Size(20, 20) },
          title: ponto.nome,
        });
      })
      .filter(Boolean);

    setMarkers((prev) => ({ ...prev, pontos: novosMarkers }));
  }, [pontos, map]);

  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter.current}
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
      <CaminhaoRealtime
  onPosicaoUpdate={setPosicaoCaminhaoRealtime}
  onReset={() =>
    setRotas((prev) => ({
      ...prev,
      realtime: [], // limpa Polyline do caminhão em tempo real
    }))
  }
/>

      {/* Rotas */}
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
