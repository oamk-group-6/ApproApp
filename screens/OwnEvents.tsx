import { useAuth } from '../firebase/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';

import { RootStackParamList } from '../navigation/types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from 'react';
import { getOwnEvents } from '../firebase/services/eventService';
import { Event } from "../firebase/types/event";
import { globalStyles } from '../styles/global';





type OwnEventsProps = NativeStackScreenProps<RootStackParamList, 'OwnEvents'>

export default function OwnEvents({navigation}: OwnEventsProps) {
  const { user, loading } = useAuth();
  const [ownEvents, setOwnEvents] = useState<Event[]>([])
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    const loadOwnEvents = async () => {
        if(!user) return

        const data = await getOwnEvents(user.uid)

        setOwnEvents(data)
    }

    loadOwnEvents()
  }, [user])
  
  const filtered = ownEvents.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Event }) => (
          <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.date}>
                {item.date ? new Date(item.date).toLocaleDateString("fi-FI") : ""}
              </Text>

              <TouchableOpacity style={[globalStyles.button, styles.button]} onPress={() => navigation.navigate("Map", { eventId: item.id })}>
                <Text style={globalStyles.buttonText}>Tarkastele</Text>
              </TouchableOpacity>
          </View>
      )

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.headerTitle}>Omat tapahtumat</Text>

      <TextInput
        placeholder="Hae tapahtumia"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          ListEmptyComponent={
            <Text>{ownEvents.length === 0 ? 
              "Et ole vielä liittynyt mihinkään tapahtumaan." : 
              `Ei tuloksia haulle "${search}"`}
            </Text>
          }
      />
      

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        alignItems: "center"
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "700"
    },
    date: {
      fontSize: 16,
      fontWeight: "500"
    },
    list: {
        width: "100%"
    },
    headerTitle: {
      fontWeight: "bold",
      fontSize: 24,
      marginBottom: 24,
      marginTop: 8
    },
    button: {
      width: 120
    },
    search: {
      padding: 10,
      backgroundColor: "#eee",
      borderRadius: 10,
      width: "90%",
      margin: 8,
      textAlign: "center"
    },
});