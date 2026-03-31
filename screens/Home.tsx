import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import {StyleSheet, Text, View} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import NavBarBottom from "../components/NavBarBottom";

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function Home({navigation}: HomeProps) {
/*
    useLayoutEffect(() => {
        navigation.setOptions({ 
            headerStyle: { backgroundColor: 'lightblue' },
            headerTitleStyle: { fontWeight: 'bold' },
            title: 'Home',
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