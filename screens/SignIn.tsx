import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from "../styles/global";

export default function LoginScreen({navigation}: any) {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleLogin = () => {
        if(!email || !password){
            Alert.alert('Virhe','Täytä kaikki kentät')
            return
        }

        // feikki login jolla pystyy testata kirjautumisen toimintaa, tästä ohjaus main pagelle
        navigation.replace()
    }
  
    return (
    <View style={styles.container}><View style={styles.innerContainer}>
      <Text style={styles.title}>Kirjautuminen</Text>

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

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Kirjaudu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userText} onPress={() => navigation.replace("Register")}>
        <Text>Oletko uusi käyttäjä?{" "}
            <Text style={styles.clickableText}>Rekisteröidy</Text>
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    
    </View></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer:{
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
