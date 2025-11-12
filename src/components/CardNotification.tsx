import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Importamos a interface que define o tipo da notificação
// (Ajuste o caminho se necessário)
import { NotificationType } from "@/src/Types";

// 1. Definimos os tipos das props que o CardNotification espera receber
interface CardProps {
  notification: NotificationType;
  onMarkAsRead: (id: number) => void; // Espera uma função que recebe um number e não retorna nada
  onDelete: (id: number) => void; // Idem
}

// 2. Aplicamos os tipos ao componente usando React.FC (Functional Component)
const NotificationCard: React.FC<CardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <View
      style={[styles.cardNotification, notification.lido && styles.cardLido]}
    >
      <View style={styles.cardContentNotification}>
        <View
          style={[
            styles.iconCardNotification,
            { backgroundColor: notification.iconBg },
          ]}
        >
          <Ionicons // @ts-ignore (Usamos isso se o iconName não for do tipo exato do Ionicons) // Se você garantiu que os nomes são corretos, pode remover o @ts-ignore
            name={notification.iconName as any} // Ou tratamos como 'any' aqui
            size={50}
            color={notification.iconColor}
          />
        </View>

        <View style={styles.componetNotification}>
          <Text style={styles.tituloNotification}>{notification.titulo}</Text>
          <Text style={styles.mensagemNotification}>
            {notification.mensagem}
          </Text>

          <Text style={styles.tempoNotification}>{notification.tempo}</Text>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(notification.id)}
        >
          <Ionicons name="trash" size={25} color="#ff0000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onMarkAsRead(notification.id)}
        >
          <Text style={styles.marcarLido}>Marcar como Lido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardNotification: {
    width: "97%",
    height: 120,
    padding: 10,
    gap: 8,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1eeeeff",
    marginVertical: 5,
    alignSelf: "center",
  },
  cardLido: {
    opacity: 0.6,
  },
  cardContentNotification: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconCardNotification: {
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  componetNotification: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  tituloNotification: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mensagemNotification: {
    fontSize: 14,
    color: "#333",
  },
  tempoNotification: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
    height: "100%",
    paddingVertical: 5,
  },
  actionButton: {},
  marcarLido: {
    color: "#007aff",
    textAlign: "center",
  },
});

export default NotificationCard;
