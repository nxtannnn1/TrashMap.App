import React, { ComponentProps } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


// Este tipo descreve o formato de um objeto de notificação
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  // Isso garante que 'icon' seja um nome de ícone válido do Ionicons
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  iconBg: string;
}

// Este tipo descreve as propriedades (props) que o componente CardNotification espera receber
export interface CardNotificationProps {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

// 2. Definição do Componente
const CardNotification: React.FC<CardNotificationProps> = ({
  item,
  onMarkAsRead,
  onDelete,
}) => {
  // Estilo condicional: se estiver lida, aplica o estilo 'cardRead'
  const cardStyles = [
    styles.cardNotification,
    item.read ? styles.cardRead : null,
  ];

  return (
    <View style={cardStyles}>
      {/* Ícone */}
      <View
        style={[styles.iconCardNotification, { backgroundColor: item.iconBg }]}
      >
        <Ionicons name={item.icon} size={40} color={item.iconColor} />
      </View>

      {/* Conteúdo de Texto */}
      <View style={styles.componetNotification}>
        <Text style={styles.tituloNotification}>{item.title}</Text>
        <Text style={styles.mensagemNotification}>{item.message}</Text>
        <Text style={styles.tempoNotification}>{item.time}</Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        </TouchableOpacity>

        {/* Só mostra o botão de "marcar como lida" se ainda não foi lida */}
        {!item.read && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onMarkAsRead(item.id)}
          >
            <Ionicons name="eye-outline" size={24} color="#007aff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// 3. Estilos
// Contém APENAS os estilos usados por este componente
const styles = StyleSheet.create({
  cardNotification: {
    width: "95%",
    minHeight: 100,
    padding: 12,
    gap: 12,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1eeeeff",
    marginTop: 10,
    alignSelf: "center", // Importante para centralizar no FlatList
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardRead: {
    backgroundColor: "#e0e0e0",
    opacity: 0.8,
  },
  iconCardNotification: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  componetNotification: {
    flex: 1, // Ocupa o espaço restante
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
  },
  tituloNotification: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mensagemNotification: {
    fontSize: 14,
    color: "#555",
    flexWrap: "wrap",
  },
  tempoNotification: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
});

// 4. Exportação Padrão
export default CardNotification;
