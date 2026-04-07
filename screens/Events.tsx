import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {StyleSheet, Text, View, TextInput, FlatList, Touchable, TouchableOpacity} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import NavBarBottom from "../components/NavBarBottom";
import { getAllEvents } from "../firebase/services/eventService";
import { Event } from "../firebase/types/event";
import { globalStyles } from "../styles/global"
import { SafeAreaView } from "react-native-safe-area-context";


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
    const [events, setEvents] = useState<Event[]>([])
    const [search, setSearch] = useState<string>("")

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
    
    const filtered = events.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase())
    )

    const renderItem = ({ item }: { item: Event }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            {/* Myöhemmin onPressille oikea toiminto!!! */}
            <TouchableOpacity style={globalStyles.button} onPress={() => console.log("Liity tapahtumaan")}>
                <Text style={globalStyles.buttonText}>Liity</Text>
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
        backgroundColor: "gray",
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
    }
});