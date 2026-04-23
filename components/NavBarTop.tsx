import React from "react";
import { Alert, View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEvent } from "../context/EventContext";

export default function NavBarTop() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { eventId, isReady } = useEvent();

  const isMap = route.name === "MapMain";
  const isPassi = route.name === "Passi";

  return (
    <View style={styles.wrapper}>

      {/* TOP TABS */}
      <View style={styles.container}>
        {/* MAP */}
        <Pressable
          style={[styles.tab, isMap && styles.activeTab]}
          onPress={() => {
            if (!isReady) return;
            if (!eventId) {
              Alert.alert("Valitse tapahtuma ensin");
              return;
            }
            navigation.navigate("MapMain", { eventId });
          }}
        >
          <Text style={[styles.text, isMap && styles.activeText]}>Kartta</Text>
        </Pressable>

        {/* PASSI */}
        <Pressable
          style={[styles.tab, isPassi && styles.activeTab]}
          onPress={() => {
            if (!isReady) return;
            if (!eventId) {
              Alert.alert("Valitse tapahtuma ensin");
              return;
            }
            navigation.navigate("Passi", { eventId });
          }}
        >
          <Text style={[styles.text, isPassi && styles.activeText]}>Appropassi</Text>
        </Pressable>
      </View>

      {/* CURRENT EVENT BUTTON (RIGHT SIDE, UNDER TABS) */}
      <View style={styles.eventButtonRow}>
        <TouchableOpacity
          style={styles.eventInfoButton}
          onPress={() => navigation.navigate("CurrentEvent", { eventId })}
        >
          <Text style={styles.eventInfoText}>tapahtuman tiedot</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 12,
  },

  container: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6e6e6",
  },

  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#575757",
    borderWidth: 1,
  },

  text: {
    color: "#888",
    fontWeight: "500",
  },

  activeText: {
    color: "#000",
    fontWeight: "700",
  },

  /* ROW UNDER TABS */
  eventButtonRow: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 6,
  },

  /* SQUARE BLACK BUTTON */
  eventInfoButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,     // square style
    alignItems: "center",
    justifyContent: "center",
  },

  eventInfoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});
