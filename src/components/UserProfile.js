import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, where, collection, limit, doc } from "firebase/firestore";
import PostFeed from "./PostFeed";
import Image from "next/dist/client/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <Image
        src={user?.photoURL}
        className="card-img-center"
        alt="user photo"
      />
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayName}</h1>
    </div>
  );
}
