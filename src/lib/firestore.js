import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  limit,
  orderBy,
  getDocs,
  getDoc,
  collectionGroup,
} from "firebase/firestore";

export async function getUserWithUsername(firestore, username) {
  let userDoc;
  const usersCollection = collection(firestore, "users");
  const userQuery = query(
    usersCollection,
    where("username", "==", username),
    limit(1)
  );
  const userDocs = await getDocs(userQuery);
  if (userDocs) userDoc = userDocs.docs[0].data();
  else userDoc = new Error("not found");
  return userDoc;
}

export async function getPostWithUsername(firestore, username, slug) {
  const usernameRef = doc(firestore, "usernames", username);
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) return;

  const usernameDoc = usernameSnap.data();
  const userRef = doc(firestore, "users", usernameDoc.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  return doc(userRef, "posts", slug);
}

/* export async function getPosts(firestore, limitNumber) {
  const postsCollection = collectionGroup(firestore, "posts");
  const postsQuery = query(
    postsCollection,
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  const postsSnapshot = await getDocs(postsCollection);
  postsSnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
} */

export async function getUserPosts(userRef) {
  const userPosts = [];
  const userPostsCollection = collection(userRef, "posts");
  const postsQuery = query(userPostsCollection, orderBy("created_at", "desc"));
  const userPostsDoc = await getDocs(postsQuery);

  userPostsDoc.forEach((doc) => {
    userPosts.push(doc.data());
  });
  return userPosts;
}
