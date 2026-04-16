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
import { db } from "../firebaseConfig"
import { Bar } from "../types/bar";

export const getAllBars = async (): Promise<Bar[]> => {
    try {
        const q = query(collection(db, "bars"), orderBy("name", "asc"))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc)=> ({id: doc.id, ...doc.data()})) as Bar[]
    } catch (error) {
        console.error("Error getting bars:", error)
        throw error
    }
}

export const getBarById = async (id: string): Promise<Bar | null> => {
    try {
        const docRef = doc(db, "bars", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as Bar
        } else {
            return null
        }
    } catch (error) {
        console.error("Error getting bar:", error)
        throw error
    }
}