import { RootStackParamList } from "@/app/types";
import api from "@/src/services/api"; // <-- Importa nossa instância do Axios
import { Usuario } from "@/src/Types"; // <-- Importa o tipo que acabamos de criar
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NavigationProps = StackNavigationProp<RootStackParamList>;

// URL de fallback
const fallbackProfileImageUrl =
  "https://i.pravatar.cc/150?u=a042581f4e29026704d";

function UsuarioScreen() {
  const navigation = useNavigation<NavigationProps>();

  // --- ESTADOS PARA OS DADOS DA API ---
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- EFEITO PARA BUSCAR DADOS DA API QUANDO A TELA ABRE ---
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        setError(null);

        // ATENÇÃO: Ajuste este endpoint ('/meu-perfil') para o endpoint real
        // da sua API que retorna os dados do usuário logado.
        const response = await api.get("/meu-perfil");

        setUsuario(response.data);
      } catch (err) {
        // console.error("Erro ao buscar usuário:", err);
        // setError("Não foi possível carregar os dados do perfil.");

        console.warn(
          "Perfil não logado ou erro ao buscar. Redirecionando...",
          err
        );
        navigation.navigate("Login"); // Redireciona para o Login
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []); // O array vazio [] garante que isso rode apenas 1 vez

  // --- RENDERIZAÇÃO CONDICIONAL (LOADING, ERRO) ---

  if (loading) {
    return (
      <View style={[styles.containerScroll, styles.centerContent]}>
        <ActivityIndicator size="large" color="#212ff1ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.containerScroll, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Se não está carregando, não tem erro, mas usuário é nulo
  if (!usuario) {
    return (
      <View style={[styles.containerScroll, styles.centerContent]}>
        <Text style={styles.errorText}>Nenhum dado de usuário encontrado.</Text>
      </View>
    );
  }

  // --- RENDERIZAÇÃO DE SUCESSO (DADOS CARREGADOS) ---
  const profileImageUrl = usuario.fotoUrl || fallbackProfileImageUrl;

  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.viewContentWrapper}>
        <View style={styles.viewImage}>
          <Image
            source={{ uri: profileImageUrl }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          />
          <View style={styles.viewIcon}>
            <Ionicons
              style={styles.iconEdit}
              key="Editar"
              name="pencil-sharp"
              onPress={() => navigation.navigate("EditUsuario")}
            />
          </View>
        </View>
        <View style={styles.infoUsuario}>
          {/* Dados agora vêm do estado 'usuario' */}
          <Text style={styles.tagUsuario}>ID</Text>
          <Text>{usuario.id}</Text>
          <Text style={styles.tagUsuario}>NOME</Text>
          <Text>{usuario.nome}</Text>
          <Text style={styles.tagUsuario}>EMAIL</Text>
          <Text>{usuario.email}</Text>
          <Text style={styles.tagUsuario}>ENDEREÇO</Text>
          <Text>{usuario.endereco}</Text>
          <Text style={styles.tagUsuario}>CIDADE</Text>
          <Text>{usuario.cidade}</Text>
        </View>
        <View style={styles.viewBottom}>
          <View style={styles.viewButtonsContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                /* Lógica para Ajuda e Suporte */
              }}
            >
              <Text style={styles.buttonText}>Ajuda e Suporte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                /* Lógica para Configuração */
              }}
            >
              <Text style={styles.buttonText}>Configuração e Privacidade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Sair da conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                /* Lógica para Configuração */
              }}
            >
              <Text style={styles.buttonText}>Excluir conta</Text>
            </TouchableOpacity>
          </View>
          <Text>Versão 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    backgroundColor: "#edf0eeff",
    paddingBottom: 50,
  },
  // --- ADICIONADO ---
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edf0eeff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // ------------------
  viewContentWrapper: {
    width: "100%",
    alignItems: "center",
  },
  viewImage: {
    width: 155,
    height: 155,
    borderRadius: 100,
    marginTop: 25,
    backgroundColor: "#212ff1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  viewIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6EB030",
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  iconEdit: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    fontSize: 20,
  },
  infoUsuario: {
    width: "90%",
    marginTop: 30,
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#a8a7a7ff",
    alignItems: "flex-start",
  },
  tagUsuario: {
    fontWeight: "bold",
    marginTop: 10,
  },
  viewBottom: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 80,
  },
  customButton: {
    backgroundColor: "#212ff1ff", // Uma cor de fundo
    padding: 15,
    borderRadius: 8,
    width: "100%", // Para preencher a largura do contêiner pai
    marginVertical: 5, // Espaçamento entre os botões
    alignItems: "center", // Centraliza o texto
  },
  buttonText: {
    color: "#ffffff", // Cor do texto
    fontWeight: "bold",
    fontSize: 16,
  },
  viewButtonsContainer: {
    // O antigo 'viewButtom'
    width: "90%", // Garante que os botões tenham uma largura definida
    alignItems: "center",
    marginBottom: 10,
  },
});
export default UsuarioScreen;
