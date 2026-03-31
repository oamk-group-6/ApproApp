import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Events from "../screens/Events";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";
import Home from "../screens/Home";

export type RootStackParamList = {
  Events: undefined
  Map: undefined
  Passi: undefined
  QRScanner: undefined
    Home: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function NavBarBottom() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Events">
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Passi" component={Passi} />
        {/* <Stack.Screen name="QRScanner" component={QRScanner} /> */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

