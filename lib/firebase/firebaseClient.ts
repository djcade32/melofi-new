// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "melofi-v2.firebaseapp.com",
  projectId: "melofi-v2",
  storageBucket: "melofi-v2.appspot.com",
  messagingSenderId: "922776747697",
  appId: "1:922776747697:web:b7b40b227c5a987835ec90",
  measurementId: "G-J2YND7L37W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = () => {
  if (typeof window !== "undefined") {
    return firebase.analytics();
  } else {
    return null;
  }
};

export const getFirebaseDB = (): Firestore | undefined => {
  if (!process.env.FIREBASE_API_KEY && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.log("FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_API_KEY are not defined in .env");
    return;
  }
  try {
    // Initialize Firebase
    const db = getFirestore(app);
    console.log("INFO: Firebase DB Connected");
    return db;
  } catch (error) {
    console.log("ERROR: Firebase DB Connection Failed");
    console.log(error);
    return;
  }
};

export const getFirebaseAuth = () => {
  if (!process.env.FIREBASE_API_KEY && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.log("FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_API_KEY are not defined in .env");
    return;
  }
  try {
    const auth = getAuth(app);
    return auth;
  } catch (error) {
    console.log("ERROR: Firebase Auth Connection Failed");
    console.log(error);
    return;
  }
};
