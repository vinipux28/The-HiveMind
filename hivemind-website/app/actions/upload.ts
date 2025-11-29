'use server'

import cloudinary from "@/lib/cloudinary"

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File
  
  if (!file) {
    return { error: "No file provided" }
  }

  // Convert file to buffer for streaming
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "hivemind-uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return { url: result.secure_url }

  } catch (error) {
    console.error("Upload failed:", error)
    return { error: "Upload failed" }
  }
}