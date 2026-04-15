import { useAuth } from './firebase/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QRScanner from './screens/QRScanner';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import SignIn from './screens/SignIn'
import SignUp from './screens/SignUp'

import HomeScreen from './screens/HomeScreen';
import Home from './screens/Home';
import Passi from './screens/Passi';
import Events from './screens/Events';
import OwnEvents from './screens/OwnEvents'
import Map from './screens/Map';
import NavBarBottom from './components/NavBarBottom';
import NavBarTop from './components/NavBarTop';
import UserPage from './screens/UserPage';
import { RootStackParamList } from './navigation/types/navigation';



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
          <Stack.Screen name="MainTabs" component={NavBarBottom} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="OwnEvents" component={OwnEvents} />
          <Stack.Screen name="QRScanner" component={QRScanner} />
          <Stack.Screen name="UserPage" component={UserPage} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={SignIn} />
            <Stack.Screen name="Register" component={SignUp} />
          </>
        )}
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});