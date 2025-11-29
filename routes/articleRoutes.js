const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const uploadArticle = require('../config/multerArticle');

const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

// Public
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Admin
router.post('/', auth(), uploadArticle.single("image"), createArticle);
router.put('/:id', auth(), uploadArticle.single("image"), updateArticle);
router.delete('/:id', auth(), deleteArticle);

module.exports = router;
