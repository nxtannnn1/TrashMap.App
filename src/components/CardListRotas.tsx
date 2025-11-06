import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList, // Usaremos FlatList para a lista dinâmica
  Pressable, // Para tornar os itens clicáveis
} from "react-native";
import { Rota } from "@/src/Types"; // Importando nosso tipo centralizado

// 1. Definimos as props que o componente espera receber
interface CardRotasProps {
  data: Rota[]; // Um array de Rotas
  onPressRota?: (rota: Rota) => void; // Uma função opcional de callback
}

// 2. Recebemos { data, onPressRota } como props
const CardRotas: React.FC<CardRotasProps> = ({ data, onPressRota }) => {
  // 3. Função que renderiza CADA item da lista
  const renderRotaItem = ({ item }: { item: Rota }) => (
    <Pressable
      style={styles.rotaItem}
      // Chama a função de callback quando o item é pressionado
      onPress={() => (onPressRota ? onPressRota(item) : {})}
    >
      {/* Usamos os dados do 'item' (ex: item.nome) */}
      <Text style={styles.rotaNome}>{item.nome}</Text>

      {/* Mostra os pontos apenas se existirem */}
      {item.pontos && (
        <Text style={styles.rotaPontos}>Pontos - {item.pontos}</Text>
      )}
    </Pressable>
  );

  // 4. O que mostrar se a lista de 'data' estiver vazia
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhuma rota encontrada.</Text>
    </View>
  );

  // 5. O componente principal agora usa a FlatList
  return (
    <View style={styles.cardContainer}>
      <FlatList
        data={data}
        renderItem={renderRotaItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ paddingBottom: 20 }} // Garante um espaço no final
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: Platform.OS === "ios" ? 10 : 0, // Ajustei o marginTop
    paddingHorizontal: Platform.OS === "ios" ? 0 : 5,
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "95%",
    alignSelf: "center",
    flex: 1, // Essencial para a FlatList preencher o espaço
    overflow: "hidden", // Garante que o conteúdo não saia das bordas
  },
  rotaItem: {
    marginVertical: 8,
    marginHorizontal: 12, // Um pouco mais de espaço nas laterais
    backgroundColor: "#f0f0f0",
    minHeight: 50, // minHeight é melhor que height para texto
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between", // Alinha nome à esquerda e pontos à direita
    alignItems: "center",
    paddingHorizontal: 20,
    // Sombra sutil
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rotaNome: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1, // Permite que o texto quebre a linha se for muito longo
  },
  rotaPontos: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10, // Espaço entre o nome e os pontos
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50, // Um pouco de espaço do topo
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default CardRotas;
