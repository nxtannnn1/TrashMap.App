import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";



const profileImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

function UsuarioScreen() {

    const navigation = useNavigation();

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
          <Text style={styles.tagUsuario}>ID</Text>
          <Text>BR17BOZ0VSLUL413BR4Z1N0</Text>
          <Text style={styles.tagUsuario}>NOME</Text>
          <Text>Leticia Silva Falcão</Text>
          <Text style={styles.tagUsuario}>GENERO</Text>
          <Text>Feminino</Text>
          <Text style={styles.tagUsuario}>EMAIL</Text>
          <Text>letsilva@gmail.com</Text>
          <Text style={styles.tagUsuario}>ENDEREÇO</Text>
          <Text>Av. Caminho de Areia - 157</Text>
          <Text style={styles.tagUsuario}>CIDADE</Text>
          <Text>Salvador - BA</Text>
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
              onPress={() => navigation.navigate("Login")}>
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
