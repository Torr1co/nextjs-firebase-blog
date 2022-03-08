import Loader from "../components/Loader";
import { UploadProgress } from "../lib/firestorage";

import { useState } from "react";
import { useUser, useStorage } from "reactfire";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [progress, setProgress] = useState(null);

  const { status, data: user } = useUser();
  const storage = useStorage();

  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const storageRef = ref(
      storage,
      `uploads/${user.uid}/${Date.now()}.${extension}`
    );

    setUploading(true);

    const metadata = {
      contentType: `image/${extension}`,
    };
    // Starts the upload
    console.log("starting");
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        // Handle unsuccessful uploads
        toast.error("An error has Occured ");
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
        });
      }
    );
    setUploading(false);
  };

  return user ? (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  ) : null;
}
