// config/multer.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "epfo_receipts",         // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",           // auto handles pdf + images
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

export default upload;