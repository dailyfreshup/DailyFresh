import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const UPLOAD_TIMEOUT_MS = 30_000;

export interface UploadedImage {
  secure_url: string;
  public_id: string;
}

export const uploadImage = (buffer: Buffer): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    let settled = false;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (settled) return;

        settled = true;
        clearTimeout(timeout);

        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    const timeout = setTimeout(() => {
      if (settled) return;

      settled = true;
      stream.destroy(new Error("Cloudinary upload timed out"));
      reject(new Error("Cloudinary upload timed out"));
    }, UPLOAD_TIMEOUT_MS);

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
