import cloudinary from "../config/cloudinary";

interface UploadOptions {
  folder?: string;             // e.g., "lesson-videos", "course-thumbnails"
  resourceType?: "image" | "video" | "raw";  // Default: "image"
  publicId?: string;           // Optional custom filename
  overwrite?: boolean;         // Replace existing file if same publicId
  transformation?: object[];   // Optional transformations (resize, crop, etc.)
}


export const uploadToCloudinary = async (
  filePath: string,
  options: UploadOptions = {}
) => {
  const {
    folder = "misc",
    resourceType = "image",
    publicId,
    overwrite = true,
    transformation,
  } = options;

  return cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    folder,
    public_id: publicId,
    overwrite,
    transformation,
  });
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
