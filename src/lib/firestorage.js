import { useStorageTask } from "reactfire";

export function UploadProgress({ uploadTask, storageRef }) {
  const { status, data: uploadProgress } = useStorageTask(
    uploadTask,
    storageRef
  );

  let percentComplete;

  if (status === "loading") {
    percentComplete = "0%";
  } else {
    const { bytesTransferred, totalBytes } = uploadProgress;
    percentComplete = Math.round(100 * (bytesTransferred / totalBytes)) + "%";
  }

  return <span>{percentComplete} uploaded</span>;
}
