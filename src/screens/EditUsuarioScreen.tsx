// Arquivo: src/screens/EditUsuarioScreen.tsx

import { AppScreenProps } from "@/app/(navigation)/types";
import { Ionicons } from "@expo/vector-icons";
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
} from "react-native";

interface UserData {
  id: string;
  nome: string;
  genero: string;
  email: string;
  endereco: string;
  cidade: string;
}

// Dados simulados para pré-preencher os campos
const initialUserData = {
  id: "BR17BOZ0VSLUL413BR4Z1N0",
  nome: "Leticia Silva Falcão",
  genero: "Feminino",
  email: "letsilva@gmail.com",
  endereco: "Av. Caminho de Areia - 157",
  cidade: "Salvador - BA",
};

interface EditUsuarioScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const profileImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

function EditUsuarioScreen({ navigation }: AppScreenProps<"EditUsuario">) {
  // Use o hook useState para gerenciar o estado dos dados do usuário
  const [userData, setUserData] = useState<UserData>(initialUserData);

  // Função para atualizar um campo específico
  const handleChange = (field: keyof typeof initialUserData, value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Lógica de salvar (simulação)
  const handleSave = () => {
    // Aqui você enviaria os dados (userData) para a sua API/backend.
    console.log("Dados a serem salvos:", userData);
    Alert.alert("Sucesso", "Seus dados foram atualizados!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.viewContentWrapper}>
        {/* Imagem de Perfil e Ícone (Mantido para consistência) */}
        <View style={styles.viewImage}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <View style={styles.viewIcon}>
            {/* O ícone aqui pode ser para trocar a foto, não vamos navegar */}
            <Ionicons
              style={[styles.iconEdit, { color: "#ffffff" }]}
              name="camera"
              onPress={() =>
                Alert.alert("Funcionalidade", "Abrir seletor de fotos.")
              }
            />
          </View>
        </View>

        {/* Campos de Edição */}
        <View style={styles.infoUsuario}>
          {/* ID (Geralmente não editável, mantido como texto) */}
          <Text style={styles.tagUsuario}>ID</Text>
          <Text style={styles.fieldValue}>{userData.id}</Text>

          {/* NOME */}
          <Text style={styles.tagUsuario}>NOME</Text>
          <TextInput
            style={styles.textInput}
            value={userData.nome}
            onChangeText={(text) => handleChange("nome", text)}
            placeholder="Digite seu nome"
          />

          {/* GÊNERO */}
          {/* Nota: Para o Gênero, o ideal seria um Picker/Dropdown, mas usamos TextInput por simplicidade */}
          <Text style={styles.tagUsuario}>GÊNERO</Text>
          <TextInput
            style={styles.textInput}
            value={userData.genero}
            onChangeText={(text) => handleChange("genero", text)}
            placeholder="Digite seu gênero"
          />

          {/* EMAIL */}
          <Text style={styles.tagUsuario}>EMAIL</Text>
          <TextInput
            style={styles.textInput}
            value={userData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />

          {/* ENDEREÇO */}
          <Text style={styles.tagUsuario}>ENDEREÇO</Text>
          <TextInput
            style={styles.textInput}
            value={userData.endereco}
            onChangeText={(text) => handleChange("endereco", text)}
            placeholder="Digite seu endereço"
          />

          {/* CIDADE */}
          <Text style={styles.tagUsuario}>CIDADE</Text>
          <TextInput
            style={styles.textInput}
            value={userData.cidade}
            onChangeText={(text) => handleChange("cidade", text)}
            placeholder="Digite sua cidade"
          />
        </View>

        {/* Botão de Salvar */}
        <View style={styles.viewBottom}>
          <View style={styles.viewButtonsContainer}>
            <TouchableOpacity
              style={[styles.customButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    backgroundColor: "#edf0eeff",
    flex: 1,
  },
  viewContentWrapper: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50, // Adicionado padding inferior para evitar corte
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#ddd",
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
    marginTop: 10,
    marginLeft: 10,
    fontSize: 20,
  },
  infoUsuario: {
    width: "90%",
    marginTop: 30,
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#ffffff", // Cor clara para melhor contraste com TextInput
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagUsuario: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    fontSize: 12,
    color: "#555",
  },
  fieldValue: {
    // Estilo para campos não editáveis (como o ID)
    color: "#777",
    marginBottom: 5,
  },
  textInput: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  viewBottom: {
    width: "100%",
    alignItems: "center",
    marginTop: 30, // Reduzi a margem superior
    marginBottom: 30,
  },
  viewButtonsContainer: {
    width: "90%",
    alignItems: "center",
  },
  customButton: {
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginVertical: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#1E603A", // Cor de destaque para salvar
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditUsuarioScreen;
