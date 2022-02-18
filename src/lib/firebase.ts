// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEC8HFlrPphz4VX4lhUtICGJwB-_YJpA4",
  authDomain: "intellicards.firebaseapp.com",
  projectId: "intellicards",
  storageBucket: "intellicards.appspot.com",
  messagingSenderId: "155055458560",
  appId: "1:155055458560:web:bb99b5e7917a2a95b2cbe5",
  measurementId: "G-9WJF6GVJ4F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
