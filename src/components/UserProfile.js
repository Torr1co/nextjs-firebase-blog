import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, where, collection, limit, doc } from "firebase/firestore";
import PostFeed from "./PostFeed";

export default function UserProfile({ username }) {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, "users");

  //search in firestore
  const userQuery = query(
    usersCollection,
    where("username", "==", username),
    limit(1)
  );
  const { status, data: user } = useFirestoreCollectionData(userQuery);
  if (status === "loading") return <div className="loader"></div>;
  console.log(user[0]);

  return (
    <>
      <div className="box-center">
        <img src={user[0].photoURL} className="card-img-center" />
        <p>
          <i>@{user[0].username}</i>
        </p>
        <h1>{user[0].displayName}</h1>
      </div>
      {/* <PostFeed user={user[0]} /> */}
    </>
  );
}
