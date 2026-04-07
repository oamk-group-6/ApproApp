import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import NavBarBottom from "../components/NavBarBottom";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";
import NavBarTop from "../components/NavBarTop";


type MapProps = NativeStackScreenProps<RootStackParamList, 'Map'>

export default function Map({ navigation }: MapProps) {

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

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
            />
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
});
