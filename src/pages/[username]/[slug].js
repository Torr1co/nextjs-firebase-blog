import { getPostWithUsername } from "../../lib/firestore";
import { useRouter } from "next/router";
import { useFirestore } from "reactfire";
import { useEffect, useState } from "react";
import PostContent from "../../components/PostContent";
import MetaTags from "../../components/MetaTags";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import { getDoc } from "firebase/firestore";
export default function Slug() {
  const firestore = useFirestore();
  const router = useRouter();
  const { username, slug } = router.query;
  const [post, setPost] = useState(null);
  const [postRef, setPostRef] = useState(null);

  console.log(post);
  useEffect(async () => {
    if (username && slug) {
      setPostRef(await getPostWithUsername(firestore, username, slug));
      if (postRef) {
        const postDoc = await getDoc(postRef);
        setPost(postDoc.data());
      }
    }
  }, [username, slug, postRef]);

  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post?.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck>
          {postRef ? <HeartButton postRef={postRef} /> : null}
        </AuthCheck>
      </aside>
    </main>
  );
}
