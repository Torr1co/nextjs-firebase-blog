import Link from "next/link";
import ReactMarkdown from "react-markdown";

// UI component for main post content
export default function PostContent({ post, content }) {
  return post ? (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post?.username}/`}>
          <a className="text-info">@{post?.username}</a>
        </Link>{" "}
        on {new Date(Number(post?.created_at)).toLocaleString()}
      </span>
      <hr />
      <ReactMarkdown>{content ? content : post?.content}</ReactMarkdown>
    </div>
  ) : (
    <div className="loader"></div>
  );
}
