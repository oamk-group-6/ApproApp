import Events from "../screens/Events";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";
import Home from "../screens/Home";
import { RootStackParamList } from "../navigation/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapStack from "../navigation/MapStack";

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
          else iconName = "compass";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
      })}
    >
        <Tab.Screen name="Map" component={MapStack} /> 
        <Tab.Screen name="Home" component={Home} /> 
        <Tab.Screen name="Events" component={Events} />      
      </Tab.Navigator>
    );
}

