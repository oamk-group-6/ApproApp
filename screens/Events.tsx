import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import {StyleSheet, Text, View} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../components/NavBarBottom";
import NavBarBottom from "../components/NavBarBottom";

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
    return (
        <View style={styles.container}>
            <Text>Events</Text>
            <StatusBar style="auto" />
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