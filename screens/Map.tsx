import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";
import NavBarTop from "../components/NavBarTop";
import { MapStackParamList } from "../navigation/MapStack";
import { EventBar, getEventBars } from "../firebase/services/eventService";
import { useEvent } from "../context/EventContext";


type MapProps = NativeStackScreenProps<MapStackParamList, 'MapMain'>

export default function Map({ route }: MapProps) {
    const { eventId, isReady } = useEvent();
    const selectedEventId = route.params?.eventId ?? eventId;

    const [bars, setBars] = useState<EventBar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        if (!selectedEventId) {
            setBars([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const loadBars = async () => {
            try {
                const data = await getEventBars(selectedEventId);
                setBars(data);
            } catch (error) {
                console.error("Error loading bars: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadBars();
    }, [selectedEventId, isReady]);
    /*
    useLayoutEffect(() => {
        navigation.setOptions({ 
            headerStyle: { backgroundColor: 'lightblue' },
            headerTitleStyle: { fontWeight: 'bold' },
            title: 'Map',
            headerRight: () => (
                <Ionicons 
                    name="arrow-forward"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('Details', {message: 'privet'})}
                />
            ),
        })
    }, []);
    */
    return (
        <SafeAreaView style={styles.container}>
            <NavBarTop />

            {!isReady ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>Ladataan tapahtumaa...</Text>
                </View>
            ) : !selectedEventId ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Valitse ensin tapahtuma, niin näytämme kartalla vain sen baarit.
                    </Text>
                </View>
            ) : loading ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>Ladataan tapahtuman baareja...</Text>
                </View>
            ) : null}

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 65.01236,
                    longitude: 25.46816,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {bars.map((bar) => (
                    <Marker
                        key={bar.id}
                        coordinate={{
                            latitude: bar.location.latitude,
                            longitude: bar.location.longitude,
                        }}
                        title={bar.name ?? "Baari"}
                    />
                ))}
            </MapView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    messageContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    messageText: {
        textAlign: "center",
        color: "#666",
    },
});
