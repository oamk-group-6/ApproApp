import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import { User } from "../types/user";

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = userCredential.user;

  const userData: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    createdAt: new Date(),
    role: "basic"
  };

  await setDoc(doc(db, "users", firebaseUser.uid), userData);

  return userData;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
