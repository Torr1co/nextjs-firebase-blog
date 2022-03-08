import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername } from "../../lib/firestore";
import { useRouter } from "next/router";
import { useFirestore } from "reactfire";
import { useEffect } from "react";
import { useState } from "react";

export default function UserProfilePage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (username) {
        setUser(await getUserWithUsername(firestore, username));
      }
    })();
  }, [username, firestore]);

  if (!username) return <div className="loader"></div>;
  return (
    <main>
      <UserProfile user={user} />
    </main>
  );
}
