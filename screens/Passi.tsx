import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    FlatList,
    Modal
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapStackParamList } from "../navigation/MapStack";
import { StatusBar } from "expo-status-bar";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, onSnapshot, getDoc, collection } from "firebase/firestore";
import NavBarTop from "../components/NavBarTop";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "../context/EventContext";
import { InfoStackParamList } from "../navigation/InfoStack";

type PassiProps = NativeStackScreenProps<MapStackParamList, 'Passi'>;

type Stamp = {
    barId: string;
    createdAt: number;
    eventId?: string;
};

type Degree = {
    name: string;
    required: number;
}

export default function Passi({ navigation, route }: PassiProps) {

    const SCREEN_WIDTH = Dimensions.get("window").width;
    const PLACEHOLDER_WIDTH = SCREEN_WIDTH * 0.92;

    const NUM_PER_ROW = 4;
    const MAX_STAMPS = 20;

    const [infoVisible, setInfoVisible] = useState(false);
    const [stamps, setStamps] = useState<Stamp[]>([]);
    const [logos, setLogos] = useState<Record<string, string>>({});
    const { eventId, isReady } = useEvent();
    const selectedEventId = route.params?.eventId ?? eventId;
    const [degrees, setDegrees] = useState<Degree[]>([]);

    // 🔥 STAMPS LISTENER
    useEffect(() => {
        const userId = auth.currentUser?.uid; 
        if (!userId) return; 
  
        const stampsRef = collection(db, "users", userId, "stamps");

        const unsub = onSnapshot(stampsRef, (snapshot) => {
            const data: Stamp[] = snapshot.docs.map(doc => ({
                barId: doc.data().barId,
                createdAt: doc.data().createdAt,
                eventId: doc.data().eventId,
            }));

            setStamps(data);
        });

        return unsub;
    }, []);

    // 🔥 LOAD LOGOS
    useEffect(() => {
        const loadLogos = async () => {
            const map: Record<string, string> = {};

            for (const stamp of stamps) {
                if (!stamp.barId) continue;

                const barRef = doc(db, "bars", stamp.barId);
                const barSnap = await getDoc(barRef);

                if (barSnap.exists()) {
                    map[stamp.barId] = barSnap.data().logo;
                }
            }

            setLogos(map);
        };

        if (stamps.length > 0) loadLogos();
    }, [stamps]);

    //  Current event (uusin stamp määrää eventin)
    const currentEventId = selectedEventId;
    // 🔥 UUSIN EVENT STAMPEISTA (TÄRKEIN FIX)
  /*
    const currentEventId =
        [...stamps]
            .sort((a, b) => b.createdAt - a.createdAt)
            .find(s => s.eventId)
            ?.eventId ?? null;
  */
//     Eventille voi määrittää tutkinnot firestoreen, tai muuten se käyttää näitä
const PLACEHOLDER_DEGREES: Degree[] = [
    { name: "Fuksi", required: 1 },
    { name: "Kandi", required: 2 },
    { name: "Maisteri", required: 3 },
    { name: "DI", required: 4 },
    { name: "Professori", required: 5 },
    { name: "Tohtori", required: 6 },
];

useEffect(() => {  
    const loadEvent = async () => {
        if (!currentEventId) {
            setDegrees(PLACEHOLDER_DEGREES);
            return;
        }

        const eventRef = doc(db, "events", currentEventId);
        const snap = await getDoc(eventRef);

        if (snap.exists()) {
            const data = snap.data();
            const fetchedDegrees = data.degrees;
            setDegrees(
                Array.isArray(fetchedDegrees) && fetchedDegrees.length > 0
                    ? fetchedDegrees
                    : PLACEHOLDER_DEGREES
            );
        } else {
            setDegrees(PLACEHOLDER_DEGREES);
        }
    };

    loadEvent();
}, [currentEventId]);

    // 🔥 FILTER STAMPS BY EVENT
    const filteredStamps = stamps.filter(
        s => currentEventId ? s.eventId === currentEventId : false
    );

    const completed = filteredStamps.length;

    const currentAchieved = degrees
        .filter(d => completed >= d.required)
        .slice(-1)[0];

    const nextDegree = degrees.find(d => completed < d.required);

    const progressText = nextDegree
        ? `${nextDegree.name} ${completed}/${nextDegree.required}`
        : `${currentAchieved?.name ?? "Valmis"} ${completed}/${completed}`;

    // 🔥 GRID
    const visibleStamps = filteredStamps.slice(0, MAX_STAMPS);

    const slots = Array.from({ length: MAX_STAMPS }, (_, i) => {
        const stamp = visibleStamps[i];  

        return {
            id: i.toString(),
            barId: stamp?.barId || null,
            done: !!stamp,
        };
    });

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>

            <NavBarTop />
            <View style={styles.topRightButton}>
    <TouchableOpacity
        onPress={() =>
            navigation.navigate("CurrentEvent", {
                eventId: currentEventId ?? undefined,
            })
        }
        style={styles.eventInfoButton}
    >
        <Text style={styles.eventInfoText}>tapahtuman tiedot</Text>
    </TouchableOpacity>
</View>


            <View style={styles.content}>

                <View style={styles.headerRow}>
                    <Text style={styles.title}>APPROPASSI</Text>

                    <TouchableOpacity
                        onPress={() => setInfoVisible(true)}
                        style={[styles.infoButton, { marginLeft: 12 }]}
                    >
                        <Text style={styles.infoText}>i</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.progress}>{progressText}</Text>

                <Text style={styles.subProgress}>
                    {currentAchieved
                        ? `Saavutettu: ${currentAchieved.name} 🎓`
                        : "Ei tutkintoa vielä"}
                </Text>

                {!isReady ? (
                    <Text style={styles.emptyText}>Ladataan tapahtumaa...</Text>
                ) : !selectedEventId ? (
                    <Text style={styles.emptyText}>Valitse ensin tapahtuma kartan kautta tai tapahtumalistasta.</Text>
                ) : null}

                <View style={[styles.passCard, { width: PLACEHOLDER_WIDTH }]}>
                    <FlatList
                        data={slots}
                        keyExtractor={(item) => item.id}
                        numColumns={NUM_PER_ROW}
renderItem={({ item }) => {
    const logoUri = item.barId ? logos[item.barId] : null;

    if (item.done) {
        return (
            <View style={styles.stampDone}>
                <Image
                    source={
                        logoUri && logoUri.startsWith("http")
                            ? { uri: logoUri }
                            : require("../assets/icon.png")
                        }
                    style={styles.logo}
                    resizeMode="contain"
                    onLoad={() => console.log("Kuva latautui:", item.barId, logoUri)}
                    onError={(e) => console.log("Kuva epäonnistui:", item.barId, logoUri, e.nativeEvent.error)}
                />
            </View>
        );
    }

    return <View style={styles.stampPending} />;
}}
                    />
                </View>

                <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => navigation.navigate("QRScanner")}
                >
                    <Text style={styles.qrText}>Skannaa QR</Text>
                </TouchableOpacity>

            </View>

            <Modal visible={infoVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Tutkinnot 🎓</Text>

                        {degrees.map((d, i) => (
                            <Text key={i} style={styles.modalText}>
                                {d.name} – {d.required} leimaa
                            </Text>
                        ))}

                        <TouchableOpacity
                            onPress={() => setInfoVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>
                                Sulje
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <StatusBar style="dark" />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
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

    passCard: {
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    topRightButton: {
    position: "absolute",
    top: "10%",     // scales with screen height
    right: "5%",    // scales with screen width
    zIndex: 999,
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
    eventInfoButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#000",   
    borderRadius: 8,           
    alignItems: "center",
    justifyContent: "center",
},

eventInfoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
},

    closeButton: {
        marginTop: 16,
        backgroundColor: "#F85F6A",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
});
