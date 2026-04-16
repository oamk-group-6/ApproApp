import { StatusBar } from "expo-status-bar";
import { useLayoutEffect, useState } from "react";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { Alert, Button, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/types/navigation";
import { globalStyles } from "../styles/global";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useAuth } from '../firebase/hooks/useAuth';
import { scanQrCode } from "../firebase/services/scanService";

type QRScannerProps = NativeStackScreenProps<RootStackParamList, 'QRScanner'>

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.7;

export default function QRScanner(/*{ navigation }: QRScannerProps*/) {

    const { user, loading } = useAuth();

    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState<boolean>(false)

    
    const addStamp = async (barId: string, eventId?: string) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        await setDoc(
            doc(db, "users", uid, "stamps", barId),
            {
                barId,
                eventId: eventId || null, // 🔥 FIX
                createdAt: Date.now(),
            }
        );
    };

    const barcodeScanned = async ({ data }: BarcodeScanningResult) => {
        setScanned(true);

        try {
            const parsed = JSON.parse(data);

            console.log("SCANNED DATA:", parsed);

            //  active check
            if (!parsed.active) {
                Alert.alert("Virhe", "QR ei ole aktiivinen");
                return;
            }

            //  barId check
            if (!parsed.barId) {
                Alert.alert("Virhe", "QR:stä puuttuu barId");
                return;
            }
          
                  if (!user) {
            Alert.alert("Virhe", "Käyttäjä ei ole kirjautunut sisään")
            return;
        }

            const barId = parsed.barId;
            const eventId = parsed.eventId; 



            //  lisää leima Firestoreen
            await addStamp(barId, eventId);


            Alert.alert("Leima lisätty! 🎉");

        } catch (error) {
            console.log(error);
            Alert.alert("Virhe", "QR koodi ei ole validi");
        }
    };

    if (!permission) return <View />

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={[globalStyles.text]}>Tarvitsee luvan kameran käyttöön</Text>
                <TouchableOpacity
                    style={[globalStyles.button]}
                    onPress={requestPermission}
                >
                    <Text style={globalStyles.buttonText}>Anna lupa</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Ladataan...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing='back'
                onBarcodeScanned={scanned ? undefined : barcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />
            

            <View style={StyleSheet.absoluteFill}>
                <View style={styles.overlay} />

                <View style={styles.middleRow}>
                    <View style={styles.overlay} />

                    <View style={styles.box}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <View style={styles.overlay} />
                </View>

                <View style={styles.overlay} />
            </View>

            {scanned && <Button title={'Skannaa uudestaan'} onPress={() => setScanned(false)} />}


            // TESTI NAPPI (FEIKKI QR SCAN)
            <TouchableOpacity
                style={{
                    position: "absolute",
                    bottom: 120,
                    alignSelf: "center",
                    backgroundColor: "#F85F6A",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    zIndex: 9999,
                    elevation: 9999,
                }}
                onPress={() =>
                    barcodeScanned({
                        data: JSON.stringify({
                            active: true,
                            barId: "873wxVW9NCcZ6GdaHkfa",
                            eventId: "dev2",
                            codeValue: "baari67",
                            createdAt: Date.now() 
                        })
                    } as any)
                }
            >
                <Text style={{ color: "white", fontWeight: "700" }}>
                    TEST SCAN
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    middleRow: {
        flexDirection: 'row',
        height: BOX_SIZE,
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderColor: '#171717',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 8,
        borderTopWidth: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 8,
        borderTopWidth: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 8,
        borderBottomWidth: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 8,
        borderBottomWidth: 8,
    },
});