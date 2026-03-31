import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "../screens/Map";
import Passi from "../screens/Passi";


export type RootStackParamList = {
  Map: undefined
  Passi: undefined

};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function NavBarTop() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Passi" component={Passi} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

