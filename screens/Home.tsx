import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, TextInput} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import QRScanner from "./QRScanner";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";
import { getNextEvent, joinEvent } from "../firebase/services/eventService";
import { Event } from "../firebase/types/event";
import { useAuth } from "../firebase/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { RootStackParamList } from "../navigation/types/navigation";
import { useEvent } from "../context/EventContext";

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function Home({navigation}: HomeProps) {
    const { user, loading } = useAuth()

    const [nextEvent, setNextEvent] = useState<Event | null>(null)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [joinCode, setJoinCode] = useState<string>("")
    const { setEventId } = useEvent();

    useLayoutEffect(() => {
        navigation.setOptions({ 
            headerStyle: { backgroundColor: 'lightblue' },
            headerTitleStyle: { fontWeight: 'bold' },
            title: 'Home',
            headerRight: () => (
                <Ionicons 
                    name="arrow-forward"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('QRScanner')}
                />
            ),
        })
    }, []);

    useEffect(() => {
      const fetchNextEvent = async () => {
        const event = await getNextEvent()
        setNextEvent(event)
      }

      fetchNextEvent()
    }, [])

    const openModal = () => {
            setModalVisible(true)
            setJoinCode("")
        }
    
    const handleJoin = async () => {
        if (!nextEvent || !user) return

        if (joinCode !== nextEvent.joinCode) {
            Alert.alert("Virhe", "Virheellinen koodi.")
            return
        }

        const result = await joinEvent(nextEvent.id, user.uid)

        if (result === "alreadyJoined") {
            Alert.alert("Olet jo liittynyt tähän tapahtumaan.")
            return
        }

        setModalVisible(false)
        setJoinCode("")

        setEventId(nextEvent.id);
        navigation.navigate("Map", {
            screen: "MapMain",
            params: { eventId: nextEvent.id }
        });
    }

    if (loading) {
        return <Text>Ladataan...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tulossa:</Text>

            {nextEvent ? (
                <>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{nextEvent.title}</Text>
                        <Text style={styles.eventDate}>{new Date(nextEvent.date).toLocaleDateString("fi-FI")}</Text>
                    </View>

                    <Image
                        source={
                            nextEvent?.imageUrl
                            ? { uri: nextEvent.imageUrl}
                            : require("../assets/poster_placeholder.jpg")
                        }
                        style={styles.image}
                        resizeMode="contain"
                    />
                
                    <TouchableOpacity style= {globalStyles.button} onPress={openModal}>
                        <Text style={globalStyles.buttonText}>Liity nyt!</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>Ei tulevia tapahtumia</Text>
            )}

            <Modal visible={modalVisible} transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{nextEvent?.title}</Text>

                        <Text style={styles.modalDescription}>{nextEvent?.description}</Text>

                        <Image
                            source={
                                nextEvent?.imageUrl
                                ? { uri: nextEvent.imageUrl }
                                : require("../assets/poster_placeholder.jpg")
                            }
                            style={styles.modalImage}
                        />

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
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 28,
        margin: 16
    },
    eventInfo: {
        alignItems: "center",
        flexDirection: "column",
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 18
    },
    eventDate: {
        fontSize: 16,
        fontWeight: "medium",
        marginTop: 2
    },
    image: {
        minWidth: 300,
        minHeight: 450,
        maxWidth: 350,
        maxHeight: 550,
        margin: 12,
        marginBottom: 36,
        marginTop: 36,
        borderRadius: 10
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
    },
    modalImage: {
        height: 180,
        width: "100%",
        borderRadius: 10,
        marginBottom: 10
    },
});
