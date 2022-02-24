import {
  useAuth,
  useSigninCheck,
  useFirebaseApp,
  AuthProvider,
} from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function AuthWrapper({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const { status, data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error("Children must be provided");
  }
  if (status === "loading") {
    return <div className="loader"></div>;
  } else if (signInCheckResult.signedIn === true) {
    return <AuthProvider sdk={auth}></AuthProvider>;
  }

  return fallback;
}
