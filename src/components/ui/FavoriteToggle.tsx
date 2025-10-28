import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FavoriteToggleProps {
  initialState?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteToggle: React.FC<FavoriteToggleProps> = ({
  initialState = false,
  onToggle,
}) => {
  // Estado para controlar se está favoritado (coração cheio) ou não (coração vazado)
  const [isFavorite, setIsFavorite] = useState(initialState);

  const handleToggle = () => {
    // Alterna o estado
    const newState = !isFavorite;
    setIsFavorite(newState);

    // Chama o callback (se fornecido) para avisar o componente pai sobre a mudança
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      // Garante que a área de toque seja decente
      hitSlop={10}
      style={({ pressed }) => [
        styles.toggleContainer,
        { opacity: pressed ? 0.7 : 1 }, // Efeito de feedback ao toque
      ]}
    >
      <Ionicons
        // Escolhe o nome do ícone baseado no estado
        name={isFavorite ? "heart" : "heart-outline"}
        style={[
          styles.iconBase,
          // Define a cor
          { color: isFavorite ? "#b31414ff" : "#8e8e93" },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    // Ajuste o tamanho da área clicável
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconBase: {
    fontSize: 28, // Tamanho do ícone
    // Remover estilos de view (width, height, background, borderRadius)
    // que foram aplicados incorretamente no ícone no seu código original
  },
});

export default FavoriteToggle;
