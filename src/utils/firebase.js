// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSFF7vysc8WrYXq7iH9_Y6vyNRjv3A8UM",
  authDomain: "word-quest-60b42.firebaseapp.com",
  projectId: "word-quest-60b42",
  storageBucket: "word-quest-60b42.firebasestorage.app",
  messagingSenderId: "180391799042",
  appId: "1:180391799042:web:8c25c1a8f45c0392f6ba1b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };
