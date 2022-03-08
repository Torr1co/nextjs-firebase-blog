import Head from "next/head";
import Link from "next/link";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import PostFeed from "../components/PostFeed";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { getPosts } from "../lib/firestore";
const LIMIT = 5;

export default function Home() {
  const firestore = useFirestore();
  const postsCollection = collectionGroup(firestore, "posts");
  const postsQuery = query(
    postsCollection,
    where("published", "==", true),
    orderBy("created_at", "desc"),
    limit(LIMIT)
  );

  const { status, data: posts } = useFirestoreCollectionData(postsQuery);
  // getPosts(firestore, LIMIT);
  console.log(posts);
  return (
    <main>
      <PostFeed posts={posts} />
      <Loader show={false} />
    </main>
  );
}
