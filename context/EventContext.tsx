import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type EventContextType = {
  eventId: string | null;
  isReady: boolean;
  setEventId: (id: string | null) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);
const STORAGE_KEY = "selectedEventId";

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadStoredEventId = async () => {
      try {
        const storedEventId = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedEventId) {
          setEventId(storedEventId);
        }
      } catch (error) {
        console.error("Error loading selected event:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadStoredEventId();
  }, []);

  const handleSetEventId = useCallback((id: string | null) => {
    const persistSelectedEvent = async () => {
      try {
        if (id) {
          await AsyncStorage.setItem(STORAGE_KEY, id);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving selected event:", error);
      }
    };

    setEventId(id);
    void persistSelectedEvent();
  }, []);

  return (
    <EventContext.Provider value={{ eventId, isReady, setEventId: handleSetEventId }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used inside EventProvider");
  }
  return context;
};
