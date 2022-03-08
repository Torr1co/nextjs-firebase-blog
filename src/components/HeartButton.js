import { useUser, useFirestore, useFirestoreDocData } from "reactfire";
import { doc, increment, collection, writeBatch } from "firebase/firestore";

export default function HeartButton({ postRef }) {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const hearthRef = doc(postRef, "hearths", user?.uid);
  const { status, data: hearth } = useFirestoreDocData(hearthRef);

  async function addHeart() {
    const uid = user?.uid;
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(hearthRef, { uid });

    await batch.commit();
  }

  // Remove a user-to-post relationship
  async function removeHeart() {
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(hearthRef);

    await batch.commit();
  }

  return hearth ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
