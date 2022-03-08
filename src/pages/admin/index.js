import styles from "../../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

import { useUser, useFirestore } from "reactfire";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getUserPosts } from "../../lib/firestore";
export default function AdminPostPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const firestore = useFirestore();
  const { status, data: user } = useUser();
  const [posts, setPosts] = useState(null);

  useEffect(async () => {
    if (status === "loading") return;
    const userRef = doc(firestore, "users", user?.uid);
    setPosts(await getUserPosts(userRef));
  }, [status]);
  return <PostFeed posts={posts} admin />;
}

function CreateNewPost() {
  const firestore = useFirestore();
  const router = useRouter();
  const { data: user } = useUser();
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = user?.uid;
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);
    const { username } = userSnap.data();
    const postRef = doc(userRef, "posts", slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      username,
      uid,
      published: false,
      content: "# hello world!",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      heartCount: 0,
    };
    console.log(data);
    await setDoc(postRef, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
