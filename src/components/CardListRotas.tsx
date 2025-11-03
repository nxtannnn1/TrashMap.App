import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function CardRotas() {
  return (
    <View style={styles.cardRotas}>
      <View style={styles.Rota}>
        <View style={styles.iconCard}>
          <Ionicons
            key="bulb"
            name="swap-horizontal-sharp"
            style={styles.iconRota}
            //onPress={() => navigation.navigate("Notification")}
          />
        </View>
        <Text>Calçada - Ribeira</Text>
        <Text>Pontos - 5</Text>
      </View>
      <View style={styles.Rota}>
        <View style={styles.iconCard}>
          <Ionicons
            key="bulb"
            name="swap-horizontal-sharp"
            style={styles.iconRota}
            //onPress={() => navigation.navigate("Notification")}
          />
        </View>
        <Text>Ribeira - Bom fim</Text>
        <Text>Pontos - 5</Text>
      </View>
      <View style={styles.Rota}>
        <View style={styles.iconCard}>
          <Ionicons
            key="bulb"
            name="swap-horizontal-sharp"
            style={styles.iconRota}
            //onPress={() => navigation.navigate("Notification")}
          />
        </View>
        <Text>Bom fim - São joaquim</Text>
        <Text>Pontos - 5</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardRotas: {
    marginTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: Platform.OS === "ios" ? 0 : 5,
    paddingVertical: Platform.OS === "ios" ? 0 : 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "95%",
    alignSelf: "center",
    flex: 1,
  },
  Rota: {
    margin: 10,
    backgroundColor: "#f0f0f0",
    width: "95%",
    height: 50,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  iconCard: {
    width: 35,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f4f4ff",
  },
  iconRota: {
    fontSize: 30,
    color: "#06530aff",
  },
});

export default CardRotas;