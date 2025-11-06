import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList, // Importamos FlatList para listas
  ActivityIndicator, // Para o loading
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "@/src/services/api"; // Importa nossa instância do Axios
import { Notificacao } from "@/src/Types"; // Importa o novo tipo

function NotificationScreen() {
  // --- ESTADOS PARA OS DADOS DA API ---
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- EFEITO PARA BUSCAR DADOS DA API QUANDO A TELA ABRE ---
  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        setLoading(true);
        setError(null);

        // ATENÇÃO: Ajuste este endpoint ('/notificacoes') para o endpoint real
        const response = await api.get("/notificacoes");

        setNotificacoes(response.data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        setError("Não foi possível carregar as notificações.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificacoes();
  }, []); // O array vazio [] garante que isso rode apenas 1 vez

  // --- COMPONENTE PARA RENDERIZAR CADA ITEM DA LISTA ---
  const renderItem = ({ item }: { item: Notificacao }) => (
    <View style={styles.cardNotification}>
      <View
        style={[
          styles.iconCardNotification,
          item.corFundoIcone ? { backgroundColor: item.corFundoIcone } : {},
        ]}
      >
        <Ionicons
          key={item.id}
          name={(item.tipoIcone || "notifications-sharp") as any} // 'as any' para nomes dinâmicos
          size={50}
          color={item.corIcone || "#e4e70dff"}
        />
      </View>
      <View style={styles.componetNotification}>
        <Text style={styles.tituloNotification}>{item.titulo}</Text>
        <Text style={styles.mensagemNotification}>{item.mensagem}</Text>
        <Text style={styles.tempoNotification}>{item.tempo}</Text>
      </View>
    </View>
  );

  // --- RENDERIZAÇÃO CONDICIONAL (LOADING, ERRO) ---

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#f1eeeeff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // --- RENDERIZAÇÃO DE SUCESSO (DADOS CARREGADOS) ---
  return (
    <View style={styles.container}>
      <FlatList
        data={notificacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingTop: 15, paddingBottom: 15 }}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>
              Nenhuma notificação encontrada.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#33b368ff",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#f1eeeeff",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#f1eeeeff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  cardNotification: {
    width: "95%",
    minHeight: 100, // minHeight é melhor para conteúdo dinâmico
    padding: 10,
    gap: 8,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1eeeeff",
    alignSelf: "center", // Para centralizar o card no FlatList
    marginBottom: 10, // Espaço entre os cards
  },
  iconCardNotification: {
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ee8989ff", // Cor de fallback
  },
  componetNotification: {
    display: "flex",
    flexDirection: "column",
    flex: 1, // Permite que o texto quebre a linha e ocupe o espaço
    paddingRight: 10, // Evita que o texto cole na borda
  },
  tituloNotification: {
    fontSize: 20,
    fontWeight: "bold", // Adicionei para destaque
  },
  mensagemNotification: {
    fontSize: 16, // Adicionei para consistência
    color: "#333",
    marginVertical: 4, // Espaçamento
  },
  tempoNotification: {
    fontSize: 12, // Adicionei
    color: "#777",
    alignSelf: "flex-end", // Alinha o tempo à direita
  },
  actionContainer: {},
  actionButton: {},
});
export default NotificationScreen;
