import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NavBarTop() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      
      {/* MAP */}
      <Pressable
        style={styles.tab}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={styles.text}>
          Kartta
        </Text>
      </Pressable>

      {/* PASSI */}
      <Pressable
        style={styles.tab}
        //onPress={() => navigation.navigate("Passi")}
      >
        <Text style={styles.text}>
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
  },

  activeTab: {
    backgroundColor: "#fff",
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