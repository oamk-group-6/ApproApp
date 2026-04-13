import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Event } from "../types/event";
import { getAllEvents } from "../firebase/events";

const CurrentScreen: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const loadCurrentEvent = async () => {
      const events = await getAllEvents();
      const current = events.find((e) => e.status === "nykyinen");
      setEvent(current || null);
    };

    loadCurrentEvent();
  }, []);

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
        <Text style={{ marginTop: 10 }}>Loading current event...</Text>
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

      {/* Location */}
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.locationBox}>
        <Text style={styles.locationText}>{event.location}</Text>
      </View>

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
    marginBottom: 20,
  },
  locationText: { fontSize: 18 },
  description: { fontSize: 16, color: "#444", marginTop: 5 },
});
