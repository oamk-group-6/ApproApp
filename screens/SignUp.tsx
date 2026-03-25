import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from "../styles/global";

export default function App() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
  
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröityminen</Text>

      <Text style={styles.inputText}>Sähköposti</Text>
      <TextInput
        placeholder='example@email.com'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <Text style={styles.inputText}>Salasana</Text>
      <TextInput
        placeholder='••••••••••••••••'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userText} onPress={() => console.log("Kirjautumiseen")}>
        <Text>Onko sinulla käyttäjätili?{" "}
            <Text style={styles.clickableText}>Kirjaudu</Text>
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '60%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 50
  },
  clickableText: {
    color: '#F85F6A',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputText: {
    color: '#F85F6A',
    fontWeight: 'bold',
    padding: 5
  },
  userText: {
    paddingTop: 5,
    alignItems: 'center'
  }
});
