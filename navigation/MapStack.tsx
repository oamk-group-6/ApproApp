import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "../screens/Map";
import Passi from "../screens/Passi";

export type MapStackParamList = {
  MapMain: undefined
  Passi: undefined
  QRScanner: undefined;
}

const Stack = createNativeStackNavigator<MapStackParamList>();

export default function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={Map} />
      <Stack.Screen name="Passi" component={Passi} />
      
    </Stack.Navigator>
  );
}