// lib/uploadToCloudinary.ts
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_uploads"); // ✅ Your actual preset name

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dsmvovsfx/image/upload", // ✅ Your cloud name is 'dsmvovsfx'
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url; // ✅ Returns the image URL hosted on Cloudinary
}
