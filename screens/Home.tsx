import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import QRScanner from "./QRScanner";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";
import { getNextEvent } from "../firebase/services/eventService";
import { Event } from "../firebase/types/event";

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function Home({navigation}: HomeProps) {
    const [nextEvent, setNextEvent] = useState<Event | null>(null)

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
                        source={require("../assets/poster_placeholder.jpg")}
                        style={styles.image}
                    />
                
                    <TouchableOpacity style= {globalStyles.button} onPress={() => console.log("Liity tapahtumaan")}>
                        <Text style={globalStyles.buttonText}>Liity nyt!</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>Ei tulevia tapahtumia</Text>
            )}
            
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
        width: 300,
        height: 500,
        margin: 12,
        marginBottom: 36,
        marginTop: 36
    }
});