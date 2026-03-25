import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QRScanner from './screens/QRScanner';

import SignIn from './screens/SignIn'
import SignUp from './screens/SignUp'

export default function App() {
  return (
    <QRScanner />
  );
}
