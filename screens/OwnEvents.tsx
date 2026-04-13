import { useAuth } from '../firebase/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { RootStackParamList } from '../navigation/types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from 'react';
import { getOwnEvents } from '../firebase/services/eventService';
import { Event } from "../firebase/types/event";




type OwnEventsProps = NativeStackScreenProps<RootStackParamList, 'OwnEvents'>

export default function App() {
  const { user, loading } = useAuth();
  const [ownEvents, setOwnEvents] = useState<Event[]>([])

  useEffect(() => {
    const loadOwnEvents = async () => {
        if(!user) return

        const data = await getOwnEvents(user.uid)

        setOwnEvents(data)
    }

    loadOwnEvents()
  }, [user])
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Event }) => (
          <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>
          </View>
      )

  return (
    <SafeAreaView>

        <FlatList
            data={ownEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
        />
      

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1
    },
    title: {
        fontSize: 16
    },
    list: {
        width: "100%"
    },
});