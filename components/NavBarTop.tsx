import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function NavBarTop() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const isMap = route.name === "MapMain";
  const isPassi = route.name === "Passi";

  return (
    <View style={styles.container}>
      
      {/* MAP */}
      <Pressable
        style={[styles.tab, isMap && styles.activeTab]}
        onPress={() => navigation.navigate("MapMain")}
      >
        <Text style={[styles.text, isMap && styles.activeText]}>
          Kartta
        </Text>
      </Pressable>

      {/* PASSI */}
      <Pressable
        style={[styles.tab, isPassi && styles.activeTab]}
        onPress={() => navigation.navigate("Passi")}
      >
        <Text style={[styles.text, isPassi && styles.activeText]}>
          Appropassi
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    margin: 12,
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    overflow: "hidden",
  },

  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#575757",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  text: {
    color: "#888",
    fontWeight: "500",
  },

  activeText: {
    color: "#000",
    fontWeight: "700",
  },
});