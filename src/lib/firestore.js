import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  limit,
  orderBy,
  getDocs,
  collectionGroup,
} from "firebase/firestore";

export async function getUserWithUsername(firestore, username) {
  const usersCollection = collection(firestore, "users");
  const userQuery = query(
    usersCollection,
    where("username", "==", username),
    limit(1)
  );
  const userDocs = await getDocs(userQuery);
  const userDoc = userDocs.docs[0].data();
  return userDoc;
}

export async function getPosts(firestore, limitNumber) {
  const postsCollection = collectionGroup(firestore, "posts");
  const postsQuery = query(
    postsCollection,
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  const postsSnapshot = await getDocs(postsCollection);
  console.log(postsSnapshot);
  postsSnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
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
