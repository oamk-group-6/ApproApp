import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from "../styles/global";
import { registerUser } from '../firebase/services/authService';

export default function RegisterScreen({navigation}: any) {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if(!email || !password){
            Alert.alert('Virhe','Täytä kaikki kentät')
            return
        }
        
        setLoading(true);
        try {
          await registerUser(email, password)
          Alert.alert('Onnistui', 'Käyttäjä luoto onnistuneesti!')
          navigation.replace("Login")
        } catch (error: any) {
          console.error(error);
          Alert.alert('Virhe', error.message || 'Rekisteröityminen epäonnistui');
        } finally {
          setLoading(false);
        }
    };

    return (
    <View style={styles.container}><View style={styles.innerContainer}>
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

      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userText} onPress={() => navigation.replace("Login")}>
        <Text>Onko sinulla käyttäjätili?{" "}
            <Text style={styles.clickableText}>Kirjaudu</Text>
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
