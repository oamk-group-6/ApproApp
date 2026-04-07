import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import { RootStackParamList } from "../App";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Passi" component={Passi} />
    </Stack.Navigator>
  );
}