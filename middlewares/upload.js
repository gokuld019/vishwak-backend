const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/gallery folder exists
const dir = "uploads/gallery";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gallery");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({ storage });

module.exports = upload;
