import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { logoutUser } from "../firebase/services/authService";
import { globalStyles } from "../styles/global";
import { RootStackParamList } from "../navigation/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type UserPageProps = NativeStackScreenProps<RootStackParamList, 'UserPage'>

export default function UserPage({ navigation }: UserPageProps) {

  const handleLogout = async () => {
  try {
    await logoutUser();

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // your root entry point
    });

  } catch (error: any) {
    Alert.alert("Virhe", error.message || "Uloskirjautuminen epäonnistui");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Käyttäjä</Text>

      <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
  },
});
