import { NavigatorScreenParams } from "@react-navigation/native";
import { MapStackParamList } from "../MapStack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Events: undefined
  OwnEvents: undefined
  Map: NavigatorScreenParams<MapStackParamList> | undefined;
  Passi: undefined
  QRScanner: undefined
  UserPage: undefined
  MainTabs: undefined
  HomeScreen: undefined
  Statistics: undefined
  CurrentEvent: undefined
};
