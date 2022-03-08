import "../../styles/globals.css";
import NavBar from "../components/NavBar";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import {
  FirebaseAppProvider,
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
  useInitFirestore,
  useFirebaseApp,
  useFirestore,
  useFirestoreDocData,
} from "reactfire";

import { getAuth } from "firebase/auth"; // Firebase v9+
import { initializeFirestore } from "firebase/firestore"; // Firebase v9+
import { getStorage } from "firebase/storage";

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
      <FireSetup>
        <Component {...pageProps} />
      </FireSetup>
    </FirebaseAppProvider>
  );
}

function FireSetup({ children }) {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const { status, data: firestore } = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    return db;
  });

  if (status === "loading") {
    return <div className="loader"></div>;
  }

  return (
    // <AppCheckProvider sdk={appCheck}>
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <StorageProvider sdk={storage}>
          <NavBar />
          {children}
          <Toaster />
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
    // </AppCheckProvider>
  );
}
export default MyApp;
