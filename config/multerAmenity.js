// config/multerAmenity.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create upload folder: /uploads/amenities
const dir = path.join(__dirname, "..", "uploads", "amenities");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "amenity_" + Date.now() + path.extname(file.originalname));
  },
});

const uploadAmenity = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = uploadAmenity;
