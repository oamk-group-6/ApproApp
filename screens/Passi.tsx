import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import {StyleSheet, Text, View} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import NavBarTop, { RootStackParamList } from "../components/NavBarBottom";
import NavBarBottom from "../components/NavBarBottom";

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
            <Text>Passi</Text>
            <StatusBar style="auto" />
            <NavBarTop />
            <NavBarBottom />
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
});