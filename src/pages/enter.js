import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  useInitPerformance,
  useSigninCheck,
  useAuth,
  useFirestore,
  useFirestoreDocData,
} from "reactfire";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { doc, writeBatch, getDoc } from "firebase/firestore";
const signOut = (auth) => auth.signOut().then(() => console.log("signed out"));
const signInWithGoogle = async (auth) => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

function Auth() {
  const { status, data: signinResult } = useSigninCheck();

  if (status === "loading") {
    return <div className="loader"></div>;
  }

  const { signedIn, user } = signinResult;

  return user ? (
    user?.displayName ? (
      <UsernameForm />
    ) : (
      <SignOutButton />
    )
  ) : (
    <SignInButton />
  );
}
export default function Enter() {
  return (
    <main>
      <Auth />
    </main>
  );
}

function SignInButton() {
  const auth = useAuth();
  return (
    <button className="btn-google" onClick={() => signInWithGoogle(auth)}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  const auth = useAuth();
  return <button onClick={() => signOut(auth)}>Sign out</button>;
}

function UsernameForm() {
  const { status, data: signinResult } = useSigninCheck();
  const { signedIn, user } = signinResult;
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log("read executed");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">{username} is not available!</p>;
    } else {
      return <p></p>;
    }
  }
  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username : {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
            <br />
          </div>
        </form>
      </section>
    )
  );
}
