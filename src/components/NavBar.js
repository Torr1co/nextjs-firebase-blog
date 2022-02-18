import NextLink from "next/link";

export default function NavBar() {
  // const { user, username } = {};
  const user = null;
  const username = null;
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NextLink href="/#">
            <button className="btn-logo">FEED</button>
          </NextLink>
        </li>

        {username && (
          <>
            <li className="push-left">
              <NextLink href="/admin">
                <button className="btn-blue">Write Posts</button>
              </NextLink>
            </li>
            <li>
              <NextLink href={`/${username}`}>
                <img src={user?.photoURL} />
              </NextLink>
            </li>
          </>
        )}
        {!username && (
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
