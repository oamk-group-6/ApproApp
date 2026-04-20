import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CurrentEvent from "../screens/CurrentEvent";

export type InfoStackParamList = {
  CurrentEvent: { eventId?: string } | undefined;
}

const Stack = createNativeStackNavigator<InfoStackParamList>();

export default function InfoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CurrentEvent" component={CurrentEvent} />
    </Stack.Navigator>
  );
}
