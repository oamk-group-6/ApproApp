import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
  setDoc
} from "firebase/firestore";

import { db } from "../firebaseConfig";
import { Event, CreateEvent } from "../types/event";

export interface EventBar {
  id: string;
  name?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

type RawBarData = {
  id?: string;
  barId?: string;
  name?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    _latitude?: number;
    _longitude?: number;
  };
  latitude?: number;
  longitude?: number;
  coordinates?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
};

const resolveBarCoordinates = (barData: RawBarData): EventBar["location"] | null => {
  const latitude =
    barData.location?.latitude ??
    barData.location?._latitude ??
    barData.coordinates?.latitude ??
    barData.coordinates?.lat ??
    barData.latitude;

  const longitude =
    barData.location?.longitude ??
    barData.location?._longitude ??
    barData.coordinates?.longitude ??
    barData.coordinates?.lng ??
    barData.longitude;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  return { latitude, longitude };
};

export const addEvent = async (eventData: CreateEvent, selectedBars: string[] = []): Promise<Event> => {
    try {
        const docRef = await addDoc(collection(db, "events"), eventData);

        const newEvent: Event = {
            id: docRef.id,
            ...eventData,
        };

        await updateDoc(doc(db, "events", docRef.id), {
            id: docRef.id,
        });

        for (const barId of selectedBars) {
          await setDoc(doc(db, "events", docRef.id, "bars", barId), {})
        }

        return newEvent;
    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
};

export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc)=> ({id: doc.id ,...doc.data() })) as Event[];
    } catch (error) {
        console.error("Error getting events:", error);
        throw error;
    }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Event;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<CreateEvent>): Promise<void> => {
  try {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, eventData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "events", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const getNextEvent = async (): Promise<Event | null> => {
  try {
    const now = new Date().toISOString().split("T")[0]

    const q = query(
      collection(db, "events"),
      where("date", ">", now),
      orderBy("date", "asc"),
      limit(1)
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    const docSnap = snapshot.docs[0]

    return{
      id: docSnap.id,
      ...docSnap.data()
    } as Event

  } catch (error) {
    console.error("Error getting next event: ", error)
    throw error
  }
}

export const joinEvent = async (eventId: string, userId: string): Promise<"joined" | "alreadyJoined"> => {

  const eventRef = doc(db, "users", userId, "events", eventId)
  const docSnap = await getDoc(eventRef)

  if (docSnap.exists()) {
    return "alreadyJoined"
  }

  await setDoc(
    doc(db, "users", userId, "events", eventId),
    {
      joinedAt: new Date()
    }
  )
  return "joined"
}

export const getUserEvents = async (userId: string): Promise<string[]> => {
  const snapshot = await getDocs(
    collection(db, "users", userId, "events")
  )

  return snapshot.docs.map(doc => doc.id)
}

export const getOwnEvents = async (userId: string): Promise<Event[]> => {
  const ids = await getUserEvents(userId)

  const events: Event[] = []

  for (const id of ids) {
    const event = await getEventById(id)

    if (event) events.push(event)
  }

  return events
}


export const getEventBars = async (eventId?: string): Promise<EventBar[]> => {
  if (!eventId) {
    return [];
  }

  try {
    const eventBarsSnapshot = await getDocs(
      collection(db, "events", eventId, "bars")
    );

    const eventBarIds = Array.from(
      new Set(
        eventBarsSnapshot.docs
          .map((eventBarDoc) => {
            const eventBarData = eventBarDoc.data() as RawBarData;
            return eventBarData.barId ?? eventBarDoc.id;
          })
          .filter((barId): barId is string => Boolean(barId))
      )
    );

    if (eventBarIds.length === 0) {
      return [];
    }

    const bars = await Promise.all(
      eventBarIds.map(async (barId) => {
        const barSnapshot = await getDoc(doc(db, "bars", barId));

        if (!barSnapshot.exists()) {
          return null;
        }

        const barData = barSnapshot.data() as RawBarData;
        const location = resolveBarCoordinates(barData);

        if (!location) {
          console.warn(`Bar ${barId} is missing valid coordinates`);
          return null;
        }

        return {
          ...barData,
          id: barSnapshot.id,
          location,
        };
      })
    );

    return bars.filter((bar): bar is EventBar => Boolean(bar));
  } catch (error) {
    console.error("Error getting event bars:", error);
        throw error;
    }
};
