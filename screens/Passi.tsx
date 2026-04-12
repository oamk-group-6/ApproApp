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
import QRScanner from "./QRScanner";
import { StatusBar } from "expo-status-bar";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import NavBarBottom from "../components/NavBarBottom";
import NavBarTop from "../components/NavBarTop";
import { Ionicons } from "@expo/vector-icons";

type PassiProps = NativeStackScreenProps<MapStackParamList, 'Passi'>;

type Stamp = {
    barId: string;
    logo: string;
};

export default function Passi({ navigation }: PassiProps) {
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const PLACEHOLDER_WIDTH = SCREEN_WIDTH * 0.92;

    const NUM_PER_ROW = 4;
    const MAX_STAMPS = 20;

    const [infoVisible, setInfoVisible] = useState(false);
    const [stamps, setStamps] = useState<Stamp[]>([]);

    //  TUTKINNOT
    const degrees = [
        { name: "Fuksi", required: 8 },
        { name: "Kandi", required: 10 },
        { name: "Maisteri", required: 12 },
        { name: "DI", required: 15 },
        { name: "Professori", required: 18 },
        { name: "Tohtori", required: 20 },
    ];

    //  FIREBASE LISTENER
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const userRef = doc(db, "users", userId);

        const unsub = onSnapshot(userRef, (snap) => {
            const data = snap.data();
            setStamps(data?.stamps || []);
        });

        return unsub;
    }, []);

    // 20 SLOTIN LOGIIKKA
    const visibleStamps = stamps.slice(0, MAX_STAMPS);

    const slots = Array.from({ length: MAX_STAMPS }, (_, i) => {
        const stamp = visibleStamps[i];

        return {
            id: i.toString(),
            barId: stamp?.barId || null,
            logo: stamp?.logo || null,
            done: !!stamp,
        };
    });

    //  PROGRESS
    const completed = stamps.length;

    const currentAchieved = degrees
        .filter(d => completed >= d.required)
        .slice(-1)[0];

    const nextDegree = degrees.find(d => completed < d.required);

    const progressText = nextDegree
        ? `${nextDegree.name} ${completed}/${nextDegree.required}`
        : `Tohtori ${completed}/${completed}`;

    return (
        <View style={styles.container}>
            {/* TITLE + INFO */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>APPROPASSI</Text>

                <TouchableOpacity
                    onPress={() => setInfoVisible(true)}
                    style={styles.infoButton}
                >
                    <Text style={styles.infoText}>i</Text>
                </TouchableOpacity>
            </View>

            {/* PROGRESS */}
            <Text style={styles.progress}>{progressText}</Text>

            <Text style={styles.subProgress}>
                {currentAchieved
                    ? `Saavutettu: ${currentAchieved.name} 🎓`
                    : "Ei tutkintoa vielä"}
            </Text>

            {/* PASSI GRID */}
            <View style={[styles.passCard, { width: PLACEHOLDER_WIDTH }]}>
                <FlatList
                    data={slots}
                    keyExtractor={(item) => item.id}
                    numColumns={NUM_PER_ROW}
                    renderItem={({ item }) => {
                        if (item.done) {
                            return (
                                <View style={styles.stampDone}>
                                    <Image
                                        source={require("../assets/ilona.png")}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                </View>
                            );
                        }

                        return <View style={styles.stampPending} />;
                    }}
                />
            </View>

            {/* QR BUTTON */}
            <TouchableOpacity
                style={styles.qrButton}
                onPress={() => navigation.navigate("QRScanner")}
            >
                <Text style={styles.qrText}>Skannaa QR</Text>
            </TouchableOpacity>

            {/* INFO MODAL */}
            <Modal
                visible={infoVisible}
                transparent
                animationType="fade"
            >
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

            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
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
        color: "#fff",
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
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
        textAlign: "center",
    },

    subProgress: {
        color: "#aaa",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },

    passCard: {
        backgroundColor: "#1E1E1E",
        borderRadius: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
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
        backgroundColor: "#2A2A2A",
        borderWidth: 2,
        borderColor: "#444",
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
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "80%",
        backgroundColor: "#1E1E1E",
        padding: 20,
        borderRadius: 16,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 12,
        textAlign: "center",
    },

    modalText: {
        color: "#ccc",
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
});