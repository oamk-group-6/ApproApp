import { StatusBar } from "expo-status-bar";
import { use, useLayoutEffect, useState } from "react";
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
import { useEvent } from "../context/EventContext";


type QRScannerProps = NativeStackScreenProps<RootStackParamList, 'QRScanner'>

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.7;

export default function QRScanner(/*{ navigation }: QRScannerProps*/) {

    const { user, loading } = useAuth();
    const { eventId } = useEvent()

    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState<boolean>(false)


    const barcodeScanned = async ({ data }: BarcodeScanningResult) => {
        if(scanned) return

        setScanned(true);

        if (!user) {
            Alert.alert("Virhe", "Käyttäjä ei ole kirjautunut sisään");
            setScanned(false);
            return;
        }

        if (!eventId) {
            Alert.alert("Virhe", "Ei valittua tapahtumaa");
            setScanned(false);
            return;
        }

        try {
            const qrCodeId = data

            console.log("SCANNED DATA:", qrCodeId);

            if (!qrCodeId) {
                Alert.alert("Virhe", "QR:stä puuttuu qrCodeId");
                setScanned(false);
                return;
            }

            const result = await scanQrCode(user.uid, qrCodeId, eventId)

            if(result.success) {
                Alert.alert("Leima lisätty! 🎉")
            } else {
                Alert.alert("Virhe", result.message)
                setScanned(false)
            }

        } catch (error) {
            console.log(error);
            Alert.alert("Virhe", "QR koodi ei ole validi frontendista");
            setScanned(false)
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