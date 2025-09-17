import { useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ImageUpload({ user }: { user: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // ✅ Check if the file is an image
    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPEG, PNG, etc).");
        return;
    }
    
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await response.json();
    await sendMessage({ user, imageStorageId: storageId });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Send Photo"
        className="image-upload-button"
      >
        📷
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
}