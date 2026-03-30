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
} from "firebase/firestore";

import { db } from "../firebaseConfig";
import { Event, CreateEvent } from "../types/event";

export const addEvent = async (eventData: CreateEvent): Promise<Event> => {
    try {
        const docRef = await addDoc(collection(db, "events"), eventData);

        const newEvent: Event = {
            id: docRef.id,
            ...eventData,
        };

        await updateDoc(doc(db, "events", docRef.id), {
            id: docRef.id,
        });

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
        return snapshot.docs.map((doc)=>doc.data() as Event);
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
