import { RootStackParamList } from "@/src/Types/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de importar Ionicons
import { useAuth } from "@/src/contexts/AuthContext";

type NavigationProps = StackNavigationProp<RootStackParamList>;

function UsuarioScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Excluir conta", "Essa ação é irreversível. Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar Exclusão",
        style: "destructive",
        onPress: () => {
          // Lógica de exclusão da API aqui
          console.log("Deletar usuário ID:", user?.id);
          signOut(); // Desloga após deletar
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Redireciona para o login após exclusão
          });
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.viewContentWrapper}>
        {/* Ícone/Imagem de Perfil */}
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImageText}>
            {user.nome.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoUsuario}>
          <Text style={styles.tagUsuario}>ID</Text>
          <Text style={styles.infoText}>{user.id}</Text>

          <Text style={styles.tagUsuario}>NOME</Text>
          <Text style={styles.infoText}>{user.nome}</Text>

          <Text style={styles.tagUsuario}>EMAIL</Text>
          <Text style={styles.infoText}>{user.email}</Text>
        </View>

        <View style={styles.viewBottom}>
          <View style={styles.viewButtonsContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                Alert.alert(
                  "Suporte",
                  "Entre em contato: suporte@trashmap.com"
                );
              }}
            >
              <Text style={styles.buttonText}>Ajuda e Suporte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate("EditUsuario")}
            >
              <Text style={styles.buttonText}>Editar Meus Dados</Text>
            </TouchableOpacity>

            {/* Botão Sair conectado à lógica */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Sair da conta</Text>
            </TouchableOpacity>

            {/* Botão Excluir conectado à lógica */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Excluir conta</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1, // Garante que o ScrollView ocupe toda a tela
    backgroundColor: "#33b368ff", // Fundo da tela
    paddingBottom: 50,
  },
  viewContentWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20, // Espaçamento vertical para o conteúdo
  },
  profileImageContainer: {
    width: 155,
    height: 155,
    borderRadius: 77.5, // Metade da largura/altura para ser um círculo
    marginTop: 25,
    backgroundColor: "#1E603A", // Cor principal da identidade
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#f0cf17ff", // Borda amarela harmoniosa
    marginBottom: 30, // Espaçamento abaixo da imagem
  },
  profileImageText: {
    fontSize: 60, // Aumentei o tamanho da letra
    color: "white",
    fontWeight: "bold",
  },
  infoUsuario: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#FFFFFF", // Fundo branco para as informações
    alignItems: "flex-start",
    marginBottom: 30, // Espaçamento abaixo do bloco de info
    elevation: 3, // Sombra leve
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tagUsuario: {
    fontWeight: "bold",
    marginTop: 15,
    color: "#1E603A", // Cor do texto da tag
    fontSize: 14,
  },
  infoText: {
    fontSize: 16,
    color: "#333", // Cor escura para o texto
    marginBottom: 5, // Espaçamento abaixo da info
  },
  viewBottom: {
    width: "100%",
    alignItems: "center",
  },
  viewButtonsContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20, // Espaçamento abaixo dos botões
  },
  customButton: {
    backgroundColor: "#1E603A", // Cor principal para botões de ação
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginVertical: 8, // Mais espaçamento vertical
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#d9534f", // Vermelho para "Sair"
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginVertical: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#c9302c", // Um vermelho mais forte para "Excluir"
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginVertical: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  versionText: {
    textAlign: "center",
    marginTop: 20, // Espaçamento para a versão
    color: "#666",
    fontSize: 12,
  },
});

export default UsuarioScreen;
