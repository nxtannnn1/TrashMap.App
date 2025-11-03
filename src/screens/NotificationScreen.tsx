import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";



function NotificationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.cardNotification}>
        <View style={styles.iconCardNotification}>
          <Ionicons
            key="bulb"
            name="bulb-sharp"
            size={50}
            color="#e4e70dff"
            //onPress={() => navigation.navigate("Notification")}
          />
        </View>
        <View style={styles.componetNotification}>
          <Text style={styles.tituloNotification}>Titulo</Text>
          <Text style={styles.mensagemNotification}>
            MENSAGEM DA NOTIFICAÇÃO
          </Text>
          <Text style={styles.tempoNotification}>16:45</Text>
        </View>
      </View>
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
  cardNotification: {
    width: "98%",
    height: 100,
    padding: 10,
    gap: 8,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1eeeeff",
  },
  iconCardNotification: {
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ee8989ff",
  },
  componetNotification: {
    display: "flex",
    flexDirection: "column",
  },
  tituloNotification: {
    fontSize: 20,
  },
  mensagemNotification: {},
  tempoNotification: {},
  actionContainer: {},
  actionButton:{},
});
export default NotificationScreen;
