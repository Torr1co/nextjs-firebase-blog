import Link from "next/link";
import { useSigninCheck } from "reactfire";

export default function AuthCheck(props) {
  const { status, data: signInResult } = useSigninCheck();

  return signInResult?.signedIn
    ? props.children
    : props.fallback || (
        <Link href="/enter">
          <a>You must be Signed In</a>
        </Link>
      );
}
