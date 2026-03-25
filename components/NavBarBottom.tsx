import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Events from "../screens/Events";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";

export type RootStackParamList = {
  Events: undefined
  Map: undefined
  Passi: undefined
  QRScanner: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function NavBarBottom() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Events">
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Passi" component={Passi} />
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

