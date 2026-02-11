// middlewares/upload.js
const multer = require("multer");

// We don't need to save files for price list / JSON-only routes,
// but we still want to parse form-data (so req.body works).
// So we just use memory storage.
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
