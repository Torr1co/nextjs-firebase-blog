import {
  getFirestore,
  doc,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";

const firestore = getFirestore();
export async function getUserWithUsername(username) {
  const userRef = doc(db, "users");
  const query = query(userRef, where("username", "==", username), limit(1));
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

export async function getUserPosts(userRef) {
  const userPostsRef = doc(userRef, "posts");
  const query = query(
    userPostsRef,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const userPostsDoc = await query.get();
  return userPostsDoc;
}
