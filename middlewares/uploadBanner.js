const multer = require("multer");
const path = require("path");
const fs = require("fs");

const bannerPath = "./uploads/banners";

if (!fs.existsSync(bannerPath)) {
  fs.mkdirSync(bannerPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannerPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.random() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
