// src/components/map/PontosMapLayer.tsx
import React from "react";
import { Marker } from "react-native-maps";
import { PontoColeta } from "@/src/Types";

interface Props {
  pontos: PontoColeta[];
}

export const PontosMapLayer: React.FC<Props> = ({ pontos }) => {
  return (
    <>
      {pontos.map((ponto) => (
        <Marker
          key={ponto.id}
          coordinate={{
            latitude: Number(ponto.latitude), // Garante que é número
            longitude: Number(ponto.longitude),
          }}
          title={ponto.nome}
          description={`ID: ${ponto.id}`}
          // image={require('@/assets/icon_lixeira.png')} // Ícone personalizado
        />
      ))}
    </>
  );
};

export default PontosMapLayer;
