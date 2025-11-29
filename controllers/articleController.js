// controllers/articleController.js
const Article = require('../models/Article');

// GET latest articles (public - homepage)
exports.getArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const articles = await Article.findAll({
      order: [['date', 'DESC']],
      limit,
    });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET article by ID (public)
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE article (admin)
exports.createArticle = async (req, res) => {
  try {
    const image = req.file ? `/uploads/articles/${req.file.filename}` : null;
    const { date, title, isMap } = req.body;

    if (!image || !date || !title) {
      return res
        .status(400)
        .json({ message: 'Image, date and title are required' });
    }

    const article = await Article.create({
      image,
      date,
      title,
      isMap: isMap === "true" ? true : false,
    });

    res.status(201).json({
      message: 'Article created successfully',
      data: article,
    });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// UPDATE article (admin)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, isMap } = req.body;

    const newImage = req.file
      ? `/uploads/articles/${req.file.filename}`
      : null;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.update({
      image: newImage ?? article.image,
      date: date ?? article.date,
      title: title ?? article.title,
      isMap: isMap === "true" ? true : article.isMap,
    });

    res.json({
      message: "Article updated successfully",
      data: article,
    });
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// DELETE article (admin)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await article.destroy();

    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
