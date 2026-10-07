import cloudinary from "./cloudinary";
import { env } from "./env";

export const uploadImage = async (
  file: File,
): Promise<{
  url: string;
  publicId: string;
}> => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.unsigned_upload(
      dataUri,
      env.CLOUDINARY_UPLOAD_PRESET!,
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY UPLOAD ERROR:", error);
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
  });
};
