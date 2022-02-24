import NextLink from "next/link";
import { AuthProvider, useSigninCheck } from "reactfire";

export default function NavBar() {
  const { status, data: signinResult } = useSigninCheck();
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NextLink href="/#">
            <button className="btn-logo">NXT</button>
          </NextLink>
        </li>

        {signinResult?.signedIn && (
          <>
            <li className="push-left">
              <NextLink href="/admin">
                <button className="btn-blue">Write Posts</button>
              </NextLink>
            </li>
            <li>
              <NextLink href={`/${signinResult?.user.displayName}`}>
                <img src={signinResult?.user?.photoURL} />
              </NextLink>
            </li>
          </>
        )}
        {!signinResult?.signedIn && (
          <li>
            <NextLink href="/enter">
              <button>Log In</button>
            </NextLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
