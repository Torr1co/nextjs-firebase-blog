import Head from "next/head";
import Link from "next/link";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

// import { getUserWithUsername, getUserPosts } from "../lib/firebase";
import { useUser } from "reactfire";
export default function Home() {
  const { status, data: user } = useUser();

  console.log(user);
  return (
    <div>
      <Loader show={false} />
      <button onClick={() => toast.success("buenass")}>Click Me</button>
    </div>
  );
}
