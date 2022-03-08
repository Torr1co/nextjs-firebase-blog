import Link from "next/Link";
import { useSigninCheck } from "reactfire";

export default function AuthCheck(props) {
  const { status, data: signInResult } = useSigninCheck();

  return signInResult?.signedIn
    ? props.children
    : props.fallback || <Link href="/enter">You must be Signed In</Link>;
}
