import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  useInitPerformance,
  useSigninCheck,
  useAuth,
  useFirestore,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { doc, writeBatch, getDoc } from "firebase/firestore";
import Image from "next/image";

//sign in and sign out functions

function SignInButton() {
  const auth = useAuth();

  const signInWithGoogle = async (auth) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <button className="btn-google" onClick={() => signInWithGoogle(auth)}>
      <Image src={"/google.png"} alt="google Logo" /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  const auth = useAuth();
  return <button onClick={() => signOut(auth)}>Sign out</button>;
}

export default function Auth() {
  const { status, data: signInResult } = useSigninCheck();
  if (status === "loading") return <div className="loader"></div>;

  //if the data is recieved, do this
  if (signInResult.signedIn === true) {
    return (
      <main>
        <UserCheck user={signInResult.user} />
      </main>
    );
  } else {
    return (
      <main>
        <SignInButton />
      </main>
    );
  }
}

function UserCheck({ user }) {
  const firestore = useFirestore();
  const userDataRef = doc(firestore, "users", user?.uid);
  const { data: userData } = useFirestoreDocData(userDataRef);
  console.log(userData);
  return userData.username ? <SignOutButton /> : <UsernameForm />;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const usernameDoc = doc(firestore, "usernames", formValue);
    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userRef, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  useEffect(() => {
    (() => checkUsername(formValue))();
  }, [formValue, checkUsername]);

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
  );
}
