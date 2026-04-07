import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {StyleSheet, Text, View, TextInput, FlatList, Touchable, TouchableOpacity, Modal, Alert} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import NavBarBottom from "../components/NavBarBottom";
import { getAllEvents, joinEvent } from "../firebase/services/eventService";
import { Event } from "../firebase/types/event";
import { globalStyles } from "../styles/global"
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../firebase/hooks/useAuth";
import { getUserEvents } from "../firebase/services/eventService";


type EventsProps = NativeStackScreenProps<RootStackParamList, 'Events'>

export default function Events({navigation}: EventsProps) {
/*
    useLayoutEffect(() => {
        navigation.setOptions({ 
            headerStyle: { backgroundColor: 'lightblue' },
            headerTitleStyle: { fontWeight: 'bold' },
            title: 'Events',
            headerRight: () => (
                <Ionicons 
                    name="arrow-forward"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('Details')}
                />
            ),
        })
    }, []);
*/
    const { user, loading } = useAuth()

    const [events, setEvents] = useState<Event[]>([])
    const [search, setSearch] = useState<string>("")
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [joinCode, setJoinCode] = useState<string>("")
    const [joinedEvents, setJoinedEvents] = useState<string[]>([])


    useEffect(() => {
      const loadEvents = async () => {
        try {
            const data = await getAllEvents()
            setEvents(data)
        } catch (error) {
            console.error(error)
        }
      }

      loadEvents()    
    }, [])

    useEffect(() => {
      const fetchJoinedEvents = async () => {
        if (!user) return

        const ids = await getUserEvents(user.uid)
        setJoinedEvents(ids)
      }

      fetchJoinedEvents()
    }, [user])
    
    const isJoined = (eventId: string) => {
        return joinedEvents.includes(eventId)
    }

    const filtered = events.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase())
    )

    const openModal = (event: Event) => {
        setSelectedEvent(event)
        setModalVisible(true)
        setJoinCode("")
    }

    const handleJoin = async () => {
        if (!selectedEvent || !user) return

        if (joinCode !== selectedEvent.joinCode) {
            Alert.alert("Virhe", "Virheellinen koodi.")
            return
        }

        const result = await joinEvent(selectedEvent.id, user.uid)

        if (result === "alreadyJoined") {
            Alert.alert("Olet jo liittynyt tähän tapahtumaan.")
            return
        }

        setJoinedEvents(prev => [...prev, selectedEvent.id])

        setModalVisible(false)
        setJoinCode("")

        navigation.navigate("Map")
    }

    if (loading) {
        return <Text>Ladataan...</Text>;
    }


    const renderItem = ({ item }: { item: Event }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity 
                style={[globalStyles.button, isJoined(item.id) && {backgroundColor: "green"}]}
                disabled={isJoined(item.id)} 
                onPress={() => openModal(item)}
            >
                
                <Text style={globalStyles.buttonText}>{isJoined(item.id) ? "Liitytty" : "Liity"}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
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
            />


            <Modal visible={modalVisible} transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>

                        <Text style={styles.modalDescription}>{selectedEvent?.description}</Text>

                        <TextInput 
                            placeholder="Avain"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            style={styles.modalTextInput}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Peruuta</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
                                <Text style={globalStyles.buttonText}>Liity</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

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
    search: {
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 10,
        width: "90%",
        margin: 8,
        textAlign: "center"
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1
    },
    title: {
        fontSize: 16
    },
    list: {
        width: "100%"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    cancelButton: {
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        width: 100
    },
    cancelButtonText: {
        color: "black",
        fontWeight: "bold"
    },
    joinButton: {
        backgroundColor: "#F85F6A",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        width: 100
    },
    modalButtons: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
    },
    modalContent: {
        width: "60%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 16
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        margin: 4
    },
    modalDescription: {
        fontSize: 14,
        color: "gray",
        margin: 4,
        marginBottom: 16
    },
    modalTextInput: {
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 16,
        textAlign: "left",
    }
});