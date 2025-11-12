import React, { useState } from "react";
import { View, StyleSheet, FlatList, ListRenderItemInfo } from "react-native";

import NotificationCard from "@/src/components/CardNotification"; // Ajuste o caminho

// Importamos a interface que define o tipo da notificação
// (Ajuste o caminho se necessário)
import { NotificationType } from "@/src/Types";

// 1. Tipamos os dados iniciais como um array de NotificationType
const INITIAL_NOTIFICATIONS: NotificationType[] = [
  {
    id: 1,
    titulo: "Coleta Próxima",
    mensagem: "O caminhão (Orgânico) passará na sua rua por volta das 10:00.",
    tempo: "09:15",
    iconName: "trash-outline", // Ícone de lixo
    iconColor: "#5d5d5d",
    iconBg: "#e8e8e8",
    lido: false,
  },
  {
    id: 2,
    titulo: "Dica de Reciclagem",
    mensagem:
      "Você sabia? Caixas de pizza engorduradas não podem ser recicladas.",
    tempo: "10:30",
    iconName: "bulb-outline", // Ícone de reciclagem
    iconColor: "#34a853",
    iconBg: "#e6f4ea",
    lido: false,
  },
  {
    id: 3,
    titulo: "Notícia Ambiental",
    mensagem: "Novo estudo aponta redução de plásticos nos oceanos.",
    tempo: "11:00",
    iconName: "earth-outline", // Ícone do planeta Terra
    iconColor: "#4285f4",
    iconBg: "#e8f0fe",
    lido: false,
  },
  {
    id: 4,
    titulo: "Coleta Seletiva",
    mensagem: "Lembrete: A coleta seletiva (Reciclável) passa hoje às 14:30.",
    tempo: "11:05",
    iconName: "cube-outline", // Ícone de "caixa" ou "pacote"
    iconColor: "#fbbc05",
    iconBg: "#fef7e0",
    lido: false,
  },
];

function NotificationScreen() {
  // 2. Tipamos o 'useState' para que ele saiba que gerencia um array de NotificationType
  const [notifications, setNotifications] = useState<NotificationType[]>(
    INITIAL_NOTIFICATIONS
  ); // 3. Corrigimos o erro (id) adicionando o tipo 'number'

  const handleMarkAsRead = (id: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notif) =>
        notif.id === id ? { ...notif, lido: true } : notif
      )
    );
  }; // 4. Corrigimos o erro (id) adicionando o tipo 'number'

  const handleDelete = (id: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notif) => notif.id !== id)
    );
  }; // 5. Corrigimos o erro ({ item }) // Usamos o tipo 'ListRenderItemInfo' do React Native, passando nosso tipo

  const renderNotification = ({
    item,
  }: ListRenderItemInfo<NotificationType>) => (
    <NotificationCard
      notification={item}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={styles.container}>
      {/* Também podemos passar o tipo para a FlatList diretamente (boa prática).
 O TypeScript agora sabe que 'data' é NotificationType[] e 'renderItem' usa NotificationType.
 */}

      <FlatList<NotificationType>
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
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
    paddingTop: 15,
  },
  list: {
    width: "100%",
  },
});

export default NotificationScreen;
