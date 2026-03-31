import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import {StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import NavBarTop, { RootStackParamList } from "../App";
import NavBarBottom from "../components/NavBarBottom";
import QRNav from "../components/QRNav";
import QRScanner from "./QRScanner";

type PassiProps = NativeStackScreenProps<RootStackParamList, 'Passi'>


export default function Passi({navigation}: PassiProps) {

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
        <View style={styles.container}>
            <Text style={styles.title}>Sinun Appropassi</Text>

            <View>
                <View style={styles.placeholder}>
                    <Text>Placeholder leimoille</Text>
                </View>
            </View>
            
        
            <View style={styles.qrContainer}>
                <Text> Skannaa koodi </Text>
                <TouchableOpacity
                    style={styles.qrBox}
                    onPress={() => navigation.navigate('QRScanner')}
                >
                    <Image
                        source={require("../assets/qr_placeholder.jpg")}
                        style={styles.qrImage}
                    >
                    </Image>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 16
    },
    qrBox: {
        width: 80,
        height: 80,
        borderWidth: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrImage: {
        width: '85%',
        height: '85%',
    },
    placeholder: {
        width: 300,
        height: 500,
        borderWidth: 1
    }
});
