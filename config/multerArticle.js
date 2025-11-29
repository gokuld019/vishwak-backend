const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Folder: /uploads/articles
const dir = path.join(__dirname, "..", "uploads", "articles");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "article_" + Date.now() + path.extname(file.originalname));
  },
});

const uploadArticle = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = uploadArticle;
