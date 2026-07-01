const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // ✅ Dynamically set resource_type based on file type
    const isPDF = file.mimetype === "application/pdf";
    return {
      folder: "epfo_receipts",
      resource_type: isPDF ? "raw" : "image", // ✅ PDF=raw, Image=image
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

// ✅ File filter — only allow PDF, JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 10,
  },
});

module.exports = upload;