import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Events from "../screens/Events";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";
import Home from "../screens/Home";
import { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function NavBarBottom() {
  return (
      <Tab.Navigator initialRouteName="Events">
        <Tab.Screen name="Events" component={Events} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Map" component={Map} />        
      </Tab.Navigator>
    );
}

