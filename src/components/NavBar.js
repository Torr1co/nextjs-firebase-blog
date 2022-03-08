import NextLink from "next/link";
import {
  AuthProvider,
  useSigninCheck,
  useFirestore,
  useFirestoreDocData,
} from "reactfire";
import { doc } from "firebase/firestore";
import Image from "next/image";

export default function NavBar() {
  const { status, data: signInResult } = useSigninCheck();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NextLink href="/#">
            <button className="btn-logo">NXT</button>
          </NextLink>
        </li>
        {signInResult?.signedIn ? (
          <NavBarSignedIn user={signInResult.user} />
        ) : (
          <NavBarNotSignedIn />
        )}
      </ul>
    </nav>
  );
}

function NavBarSignedIn({ user }) {
  const firestore = useFirestore();
  const userDataRef = doc(firestore, "users", user?.uid);
  const { data: userData } = useFirestoreDocData(userDataRef);

  return (
    <>
      <li className="push-left">
        <NextLink href="/admin" passHref>
          <button className="btn-blue">Write Posts</button>
        </NextLink>
      </li>
      <li>
        <NextLink href={`/${userData?.username}`} passHref>
          <Image src={userData?.photoURL} alt="User Logo" />
        </NextLink>
      </li>
    </>
  );
}

function NavBarNotSignedIn() {
  return (
    <li>
      <NextLink href="/enter" passHref>
        <button>Log In</button>
      </NextLink>
    </li>
  );
}
