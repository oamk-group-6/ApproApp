import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
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