import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { logoutUser } from "../firebase/services/authService";
import { addEvent } from "../firebase/services/eventService";
import AdminOnly from "./AdminOnly";
import { Bar } from "../firebase/types/bar"
import { getAllBars } from "../firebase/services/barService"


export default function HomeScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("")
  const [bars, setBars] = useState<Bar[]>([])
  const [selectedBars, setSelectedBars] = useState<string[]>([])
  const [barModalVisible, setBarModalVisible] = useState<boolean>(false)
  const [barSearch, setBarSearch] = useState<string>("")
  const [image, setImage] = useState<string>("")

  useEffect(() => {
    const fetchBars = async () => {
      const data = await getAllBars()
      setBars(data)
    }
    fetchBars()
  }, [])

  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(barSearch.toLowerCase())
  )

  const toggleBar = (barId: string) => {
    setSelectedBars(prev => 
      prev.includes(barId)
      ? prev.filter(id => id !== barId)
      : [...prev, barId]
    )
  }

  const renderItem = ({item}: {item: Bar}) => {
    const isSelected = selectedBars.includes(item.id)

    return(
      <TouchableOpacity onPress={() => toggleBar(item.id)}>
        <View style={styles.item}>
          <Text>{item.name}</Text>

          {isSelected && (
            <Text style={{color: "green"}}>valittu</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

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
        joinCode,
        imageUrl: image
      }, selectedBars);

      Alert.alert("Success", "Event created");

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setJoinCode("")
      setSelectedBars([])
      setImage("")
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

        <TextInput
          placeholder="JoinCode"
          style={styles.input}
          value={joinCode}
          onChangeText={setJoinCode}
        />

        <TextInput
          placeholder="Image URL"
          style={styles.input}
          value={image}
          onChangeText={setImage}
        />

        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginBottom: 12 }}
          />
        ) : null}

        <View style={{marginBottom: 70}}>
          <Button 
            title={`Select bars (${selectedBars.length})`} 
            onPress={() => setBarModalVisible(true)}
          />
        </View>
        
        <Button title="Add Event" onPress={handleAddEvent} />
      </>
      </AdminOnly>

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <Modal visible={barModalVisible}>
        <SafeAreaView>
          <Text style={styles.title}>Valitse baarit</Text>

          <TextInput
            placeholder="Hae baareja"
            value={barSearch}
            onChangeText={setBarSearch}
            style={styles.input}
          />

          <FlatList
            data={filteredBars}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        
          <Button title="Close" onPress={() => setBarModalVisible(false)}/>
        </SafeAreaView>

      </Modal>
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
  item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1
  },
});