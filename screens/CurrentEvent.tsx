import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { Event } from "../firebase/types/event";
import { getEventById } from "../firebase/services/eventService";
import { getEventBars, EventBar } from "../firebase/services/eventService";
import { useRoute } from "@react-navigation/native";
import { MapStackParamList } from "../navigation/MapStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEvent } from "../context/EventContext";
import NavBarTop from "../components/NavBarTop";
import { SafeAreaView } from "react-native-safe-area-context";


type CurrentEventProps = NativeStackScreenProps<MapStackParamList, 'CurrentEvent'>;


interface Props {
  route: {
    params: {
      eventId: string;
    };
  };
}

const CurrentEvent: React.FC<CurrentEventProps> = ({ navigation, route }) => {
  const { eventId } = useEvent(); // eventId is string | null
  const selectedEventId = route.params?.eventId ?? eventId ?? undefined;


  const [event, setEvent] = useState<Event | null>(null);
  const [bars, setBars] = useState<EventBar[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      const data = await getEventById(eventId);
      setEvent(data);
    };

    loadEvent();
  }, [eventId]);


  // Load bars
  useEffect(() => {
    if (!eventId) return;

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
        setTimeLeft("Tapahtuma on loppunut");
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
        <Text style={{ marginTop: 10 }}>Tapahtumaa ladataan...</Text>
      </View>
    );
  }

 return (
    <SafeAreaView style={styles.container} edges={["top"]}>

    {/* Back Button inside safe area */}
    <View style={styles.safeHeader}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
        >
            <Text style={styles.backButtonText}>Takaisin</Text>
        </TouchableOpacity>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Header */}
        <View style={styles.eventHeader}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.date}>Date: {event.date}</Text>
            </View>

            <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>

        {/* Image */}
        <Image
            source={
                event?.imageUrl
                    ? { uri: event.imageUrl }
                    : require("../assets/poster_placeholder.jpg")
            }
            style={styles.image}
            resizeMode="contain"
        />

        {/* Bars */}
        <Text style={styles.sectionTitle}>Bars</Text>

        {bars.length === 0 ? (
            <Text style={styles.noBars}>Baareja ei ole valittu tähän tapahtumaan</Text>
        ) : (
            bars.map((bar) => (
                <View key={bar.id} style={styles.locationBox}>
                    <Text style={styles.locationText}>{bar.name ?? "Unnamed bar"}</Text>
                    <Text style={styles.coords}>{bar.address}</Text>
                </View>
            ))
        )}

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>
    </ScrollView>

</SafeAreaView>

);
};

export default CurrentEvent;

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
},

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 2,
  },

  date: {
    fontSize: 16,
    color: "#666",
  },

  timeLeft: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F85F6A",
  },

  // Info Button
  infoButton: {
    marginLeft: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F85F6A",
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    color: "#fff",
    fontWeight: "800",
  },

  // Image
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },

  // Section Titles
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
  },

  // Location Box
  locationBox: {
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },

  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  coords: {
    fontSize: 14,
    color: "#666",
  },

  noBars: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },

  // Description
  description: {
    fontSize: 16,
    color: "#444",
    marginTop: 5,
  },

  // Progress Text
  progress: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },

  subProgress: {
    color: "#555",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  emptyText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  // Pass Card
  passCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  stampDone: {
    flex: 1 / 4,
    aspectRatio: 1,
    margin: 6,
    borderRadius: 999,
    backgroundColor: "#F85F6A",
    alignItems: "center",
    justifyContent: "center",
  },

  stampPending: {
    flex: 1 / 4,
    aspectRatio: 1,
    margin: 6,
    borderRadius: 999,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#CCC",
  },

  logo: {
    width: "70%",
    height: "70%",
  },

  // QR Button
  qrButton: {
    marginTop: 24,
    backgroundColor: "#F85F6A",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  qrText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },

  modalText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 6,
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "#F85F6A",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },

  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F85F6A",
    borderRadius: 6,   // small rounding, not a circle
    alignItems: "center",
    justifyContent: "center",
},


  backButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: -2,
  },
  
  scrollContent: {
    paddingBottom: 40,
}

});
