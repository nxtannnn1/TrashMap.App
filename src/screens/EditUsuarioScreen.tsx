import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreenProps } from "@/src/Types/types";

// 1. Importações para conectar com a API e Contexto
import api from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { AxiosError } from "axios";

// Imagem de placeholder (já que ainda não temos upload de foto real)
const profileImageUrl = "https://i.pravatar.cc/150?u=trashmap-user";

function EditUsuarioScreen({ navigation }: AppScreenProps<"EditUsuario">) {
  const { user, signOut } = useAuth(); // Pegamos o usuário atual

  // 2. Estados inicializados com os dados REAIS do usuário
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");

  // Campos visuais (Futura implementação no Backend)
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // 3. Lógica de Salvar
  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      // Montamos o objeto conforme o DTO do Java (UsuarioDTORequest)
      // Nota: Enviamos senha vazia para o backend ignorar a troca de senha
      const dadosAtualizados = {
        nome: nome,
        email: email,
        senha: "", // Backend foi configurado para ignorar senha vazia na edição
      };

      // Chamada PUT para /usuarios/{id}
      await api.put(`/usuarios/${user.id}`, dadosAtualizados);

      Alert.alert(
        "Sucesso",
        "Seus dados foram atualizados! Faça login novamente para ver as alterações.",
        [
          {
            text: "OK",
            onPress: () => {
              // Como o Contexto não atualiza sozinho, forçamos o logout
              // para o usuário logar de novo e baixar os dados novos.
              signOut();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            },
          },
        ]
      );
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erro ao atualizar:", err.response?.data);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar os dados. Verifique o e-mail."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.viewContentWrapper}>
        {/* === FOTO DE PERFIL === */}
        <View style={styles.profileImageContainer}>
          {/* Usamos a inicial do nome enquanto não tem foto */}
          <Text style={styles.profileImageText}>
            {nome.charAt(0).toUpperCase()}
          </Text>

          <View style={styles.viewIcon}>
            <Ionicons
              name="camera"
              size={20}
              color="#ffffff"
              onPress={() =>
                Alert.alert("Em breve", "Upload de foto será implementado.")
              }
            />
          </View>
        </View>

        {/* === FORMULÁRIO === */}
        <View style={styles.cardForm}>
          {/* ID (Apenas Leitura) */}
          <Text style={styles.label}>ID DO USUÁRIO</Text>
          <Text style={styles.valueReadOnly}>{user?.id}</Text>

          {/* NOME */}
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />

          {/* EMAIL */}
          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* CAMPOS VISUAIS (Desabilitados ou Opcionais por enquanto) */}
          {/* O Backend precisa criar tabela de endereços vinculada ao usuário para isso funcionar */}
          <Text style={styles.label}>ENDEREÇO (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço não vinculado"
            editable={false} // Travado por enquanto
          />

          <Text style={styles.label}>CIDADE (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={cidade}
            onChangeText={setCidade}
            placeholder="Cidade não vinculada"
            editable={false} // Travado por enquanto
          />
        </View>

        {/* === BOTÃO SALVAR === */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    backgroundColor: "#33b368ff", // Fundo Verde Claro da Identidade
  },
  viewContentWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
  },

  // Estilo da Imagem de Perfil (Circular com Letra)
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1E603A", // Verde Escuro
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#f0cf17ff", // Amarelo
    marginBottom: 25,
    position: "relative",
  },
  profileImageText: {
    fontSize: 50,
    color: "#FFF",
    fontWeight: "bold",
  },
  viewIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1E603A",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  // Card Branco do Formulário
  cardForm: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 4, // Sombra Android
    shadowColor: "#000", // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E603A", // Verde Escuro nos labels
    marginBottom: 5,
    marginTop: 10,
    textTransform: "uppercase",
  },
  valueReadOnly: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    paddingLeft: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    color: "#333",
  },
  inputDisabled: {
    backgroundColor: "#EEE",
    color: "#999",
  },

  // Rodapé e Botões
  footer: {
    width: "90%",
    marginTop: 30,
    alignItems: "center",
  },
  saveButton: {
    width: "100%",
    backgroundColor: "#1E603A", // Botão Verde Escuro
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#FFF", // Branco sobre o fundo verde claro fica legível? Se não, use #1E603A
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default EditUsuarioScreen;
