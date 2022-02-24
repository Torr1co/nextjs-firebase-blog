import "../../styles/globals.css";
import NavBar from "../components/NavBar";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import {
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  FirebaseAppProvider,
  AuthProvider,
} from "reactfire";

import { getAuth } from "firebase/auth"; // Firebase v9+
import { getFirestore } from "firebase/firestore"; // Firebase v9+

const firebaseConfig = {
  apiKey: "AIzaSyCO246HzqiGu6JklNXHekSLOpLj6RWTyn8",
  authDomain: "fir-next-blog-3d7de.firebaseapp.com",
  projectId: "fir-next-blog-3d7de",
  storageBucket: "fir-next-blog-3d7de.appspot.com",
  messagingSenderId: "915063877696",
  appId: "1:915063877696:web:5bf35afc2d1fa99329afa5",
  measurementId: "G-GYR2JT9LRQ",
};

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaSetup>
        <Component {...pageProps} />
      </FirebaSetup>
    </FirebaseAppProvider>
  );
}

function FirebaSetup({ children }) {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const database = getFirestore(firebaseApp);
  return (
    // <AppCheckProvider sdk={appCheck}>
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={database}>
        <NavBar />
        {children}
        <Toaster />
      </FirestoreProvider>
    </AuthProvider>
    // </AppCheckProvider>
  );
}
export default MyApp;
