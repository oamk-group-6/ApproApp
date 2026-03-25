import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import Home from "./screens/Home";
//import Details from "./screens/Details";

export type RootStackParamList = {
  Events: undefined
  Details: {message: string}
};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function NavBarBottom() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Events">
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

