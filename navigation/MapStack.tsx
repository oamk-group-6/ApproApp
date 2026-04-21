import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";
import CurrentEvent from "../screens/CurrentEvent";

export type MapStackParamList = {
  MapMain: { eventId?: string } | undefined;
  Passi: { eventId?: string } | undefined;
  QRScanner: undefined;
  CurrentEvent: { eventId?: string } | undefined;
}

const Stack = createNativeStackNavigator<MapStackParamList>();

export default function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={Map} />
      <Stack.Screen name="Passi" component={Passi} />
      <Stack.Screen name="QRScanner" component={QRScanner} />
      <Stack.Screen name="CurrentEvent" component={CurrentEvent} />
    </Stack.Navigator>
  );
}
