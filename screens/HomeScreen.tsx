import { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

import { logoutUser } from "../firebase/services/authService";
import { addEvent } from "../firebase/services/eventService";
import AdminOnly from "./AdminOnly";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = async () => {
    try {
      await addEvent({
        title,
        description,
        date,
        location,
        status: "tuleva",
      });

      Alert.alert("Success", "Event created");

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create event");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Create Event</Text>

      <AdminOnly>
      <>
        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          placeholder="Date"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          placeholder="Location"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Button title="Add Event" onPress={handleAddEvent} />
      </>
      </AdminOnly>

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});