const cloudinary = require("cloudinary");

cloudinary.v2.config(); // Auto reads CLOUDINARY_URL from .env

module.exports = cloudinary.v2;