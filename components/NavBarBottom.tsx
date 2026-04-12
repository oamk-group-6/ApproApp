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
import UserPage from "../screens/UserPage";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function NavBarBottom() {
  return (
      <Tab.Navigator
      initialRouteName="Events"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Events") iconName = "calendar";
          else if (route.name === "Home") iconName = "home";
          else if (route.name === "UserPage") iconName = "person";
          else iconName = "compass";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
      })}
    >
        <Tab.Screen name="Map" component={Map} /> 
        <Tab.Screen name="Home" component={Home} /> 
        <Tab.Screen name="Events" component={Events} /> 
        <Tab.Screen name="UserPage" component={UserPage} />   
      </Tab.Navigator>
    );
}

