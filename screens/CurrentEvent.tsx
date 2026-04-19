import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Event } from "../firebase/types/event";
import { getEventById } from "../firebase/services/eventService";
import { getEventBars, EventBar } from "../firebase/services/eventService";
import { useRoute } from "@react-navigation/native";

interface Props {
  route: {
    params: {
      eventId: string;
    };
  };
}

const CurrentScreen: React.FC<Props> = ({ route }) => {
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [bars, setBars] = useState<EventBar[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Load event
  useEffect(() => {
    const loadEvent = async () => {
      const data = await getEventById(eventId);
      setEvent(data);
    };
    loadEvent();
  }, [eventId]);

  // Load bars
  useEffect(() => {
    const loadBars = async () => {
      const data = await getEventBars(eventId);
      setBars(data);
    };
    loadBars();
  }, [eventId]);

  // Countdown timer
  useEffect(() => {
    if (!event) return;

    const interval = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Event is ongoing or ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${hours}h ${minutes}m left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading event...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>Date: {event.date}</Text>
        </View>

        <Text style={styles.timeLeft}>{timeLeft}</Text>
      </View>

      {/* Image */}
      <Image
        source={{ uri: "https://placehold.co/600x300" }}
        style={styles.image}
      />

      {/* Bars */}
      <Text style={styles.sectionTitle}>Bars</Text>

      {bars.length === 0 ? (
        <Text style={styles.noBars}>No bars selected for this event</Text>
      ) : (
        bars.map((bar) => (
          <View key={bar.id} style={styles.locationBox}>
            <Text style={styles.locationText}>{bar.name ?? "Unnamed bar"}</Text>
            <Text style={styles.coords}>
              {bar.location.latitude.toFixed(5)}, {bar.location.longitude.toFixed(5)}
            </Text>
          </View>
        ))
      )}

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{event.description}</Text>
    </View>
  );
};

export default CurrentScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 28, fontWeight: "bold" },
  date: { fontSize: 16, color: "#666" },
  timeLeft: { fontSize: 16, fontWeight: "600", color: "#d9534f" },
  image: { width: "100%", height: 200, borderRadius: 10, marginVertical: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  locationBox: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 10,
  },
  locationText: { fontSize: 18, fontWeight: "600" },
  coords: { fontSize: 14, color: "#666" },
  noBars: { fontSize: 16, color: "#888", marginBottom: 10 },
  description: { fontSize: 16, color: "#444", marginTop: 5 },
});
