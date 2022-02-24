import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
// import { getUserWithUsername } from "../../lib/firestore";
import { useRouter } from "next/router";

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  if (!username) return <div className="loader"></div>;

  return (
    <main>
      <UserProfile username={username} />
    </main>
  );
}
