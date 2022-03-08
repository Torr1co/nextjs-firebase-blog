import styles from "../../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostContent from "../../components/PostContent";
import ImageUploader from "../../components/ImageUploader";
import { useState } from "react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";

import { getPostWithUserRef } from "../../lib/firestore";
import { useUser, useFirestore } from "reactfire";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const [post, setPost] = useState(null);

  //ROUTER
  const router = useRouter();
  const { slug } = router.query;

  //FIRESTORE
  const firestore = useFirestore();
  const { data: user } = useUser();
  const userRef = doc(firestore, "users", user?.uid);
  const postRef = doc(userRef, "posts", slug);

  (async () => {
    const postSnap = await getDoc(postRef);
    setPost(postSnap.data());
  })();

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID / Slug: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
              post={post}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Go to Live Post</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview, post }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <PostContent post={post} content={watch("content")} />
        // <div className="card">
        //   <ReactMarkdown>{watch("content")}</ReactMarkdown>
        // </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name="content"
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isValid || !isDirty}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
