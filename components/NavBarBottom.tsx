import Events from "../screens/Events";
import Map from "../screens/Map";
import Passi from "../screens/Passi";
import QRScanner from "../screens/QRScanner";
import Home from "../screens/Home";
import OwnEvents from "../screens/OwnEvents";
import { RootStackParamList } from "../navigation/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserPage from "../screens/UserPage";
import MapStack from "../navigation/MapStack";


const Tab = createBottomTabNavigator<RootStackParamList>();

export default function NavBarBottom() {
  return (
      <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Events") iconName = "calendar";
          else if (route.name === "Home") iconName = "home";
          else if (route.name === "UserPage") iconName = "person";
          else if (route.name === "OwnEvents") iconName = "heart"
          else iconName = "compass";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
      })}
    >
        <Tab.Screen name="Map" component={MapStack} options={{tabBarLabel:'Kartta'}} /> 
        <Tab.Screen name="Home" component={Home} options={{tabBarLabel:'Koti'}} /> 
        <Tab.Screen name="Events" component={Events} options={{tabBarLabel:'Approt'}} />
        <Tab.Screen name="OwnEvents" component={OwnEvents} options={{tabBarLabel:'Omat Approt'}} /> 
        <Tab.Screen name="UserPage" component={UserPage} options={{tabBarLabel:'Käyttäjä'}} />   
      </Tab.Navigator>
    );
}

