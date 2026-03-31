import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";


export type RootStackParamList = {
  QRScanner: undefined

};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function QRNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}
