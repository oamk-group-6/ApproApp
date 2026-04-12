import { StatusBar } from "expo-status-bar";
import { useLayoutEffect, useState } from "react";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { Alert, Button, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/types/navigation";
import { globalStyles } from "../styles/global";

type QRScannerProps = NativeStackScreenProps<RootStackParamList, 'QRScanner'>

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.7;

export default function QRScanner(/*{ navigation }: QRScannerProps*/) {
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

    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState<boolean>(false)

    const barcodeScanned = ({ data }: BarcodeScanningResult): void => {
        setScanned(true);
        Alert.alert(`Skannaus onnistui!`, `QR: ${data}`)
    }

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
