
import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";

// Constantes definidas FORA do componente
const LIBRARIES = ["places", "geometry"];
const DEFAULT_CENTER = { lat: -12.931, lng: -38.507 };
const DEFAULT_ZOOM = 14;
const MAP_ID = "f920ced75bc6f2eee7969c92"; // Opcional

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "15px",
};

const MapaSimulacao = ({
  onMapClick,
  pontoA,
  pontoB,
  pontosRota = [],
  posicaoCaminhao = null,
  pontosDeColeta = [],
  centro = DEFAULT_CENTER,
}) => {
  // ⚠️ **MESMO ID para todos os mapas:** 'google-map-script'
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script", // ⚠️ **ID UNIFICADO**
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div style={{padding:'20px', textAlign:'center'}}>Carregando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={posicaoCaminhao || centro}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "greedy",
        mapId: MAP_ID,
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        zoomControl: true,
      }}
      onClick={(e) =>
        onMapClick &&
        onMapClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      }
    >
      {/* Marcadores dos PONTOS DE COLETA */}
      {pontosDeColeta.map((ponto) => {
        const coords = ponto.endereco?.coordenadas || ponto.coordenadas;
        const lat = parseFloat(coords?.latitude);
        const lng = parseFloat(coords?.longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker
            key={ponto.id}
            position={{ lat, lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#FF6B6B",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
              scale: 7,
            }}
            title={`${ponto.nome}`}
          />
        );
      })}

      {/* Marcador do CAMINHÃO em movimento */}
      {posicaoCaminhao && (
        <Marker
          position={posicaoCaminhao}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/truck.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title="Caminhão em Movimento"
          zIndex={999}
        />
      )}

      {/* Marcador Ponto A */}
      {pontoA?.lat && pontoA?.lng && (
        <Marker
          position={{
            lat: parseFloat(pontoA.lat),
            lng: parseFloat(pontoA.lng),
          }}
          label="A"
          title="Ponto A"
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      )}

      {/* Marcador Ponto B */}
      {pontoB?.lat && pontoB?.lng && (
        <Marker
          position={{
            lat: parseFloat(pontoB.lat),
            lng: parseFloat(pontoB.lng),
          }}
          label="B"
          title="Ponto B"
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      )}

      {/* Linha da rota */}
      {pontosRota.length > 0 && (
        <Polyline
          path={pontosRota}
          options={{
            strokeColor: "#1E90FF",
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapaSimulacao;
