import Head from "next/head";
import styles from "../../styles/Home.modules.css";
import Link from "next/link";
import Loader from "../../components/Loader";

export default function Home() {
  return (
    <div>
      <Loader show={true} />
    </div>
  );
}
