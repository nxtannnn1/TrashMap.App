import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FavoriteToggle from "./FavoriteToggle"; 

interface SearchBarProps {
  onChangeText: (text: string) => void;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChangeText, value }) => {
  // Você pode adicionar um estado aqui para saber se o favorito está ativo,
  // caso precise dessa informação no componente pai:
  // const [isFavActive, setIsFavActive] = useState(false);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#8e8e93" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar..."
          placeholderTextColor="#8e8e93"
          onChangeText={onChangeText}
          value={value}
          autoCapitalize="none"
        />
        {/* Usando o novo componente de toggle */}
        <FavoriteToggle
        // onToggle={setIsFavActive} // Descomente se precisar do estado
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: Platform.OS === "ios" ? 0 : 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    width: "100%",
    height: 60,
    marginHorizontal: 0,
  },
  icon: {
    fontSize: 20,
    padding: 14,
    color: "#8e8e93", // Melhor fixar a cor aqui
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingRight: 10,
  },
  // **REMOVA OS SEGUINTES ESTILOS** que não são mais necessários
  // iconCoracao2, iconCoracao, viewIconCoracao
});

export default SearchBar;
