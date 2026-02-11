const multer = require("multer");
const path = require("path");

// Create /uploads/brochures if not exists
const fs = require("fs");
const uploadPath = path.join(__dirname, "..", "uploads", "brochures");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/brochures");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isBrochure = file.fieldname === "brochure";
    const isThumbnail = file.fieldname === "thumbnail";

    if (isBrochure && file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed for brochure"));
    }

    if (isThumbnail) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPG, PNG, WEBP allowed for thumbnail"));
      }
    }

    cb(null, true);
  },
});

module.exports = upload;
