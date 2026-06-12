const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');
const Article = require('../models/Article');

// GET article by ID (public)
exports.getArticleById = async (req, res) => {
  try {
    const results = await sequelize.query(
      'SELECT * FROM articles WHERE id = :id LIMIT 1',
      {
        replacements: { id: req.params.id },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET latest articles (public - homepage)
exports.getArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const results = await sequelize.query(
      'SELECT * FROM articles ORDER BY date DESC LIMIT :limit',
      {
        replacements: { limit },
        type: QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE article (admin)
exports.createArticle = async (req, res) => {
  try {
    const image = req.file ? `/uploads/articles/${req.file.filename}` : null;
    const { date, title, isMap, content } = req.body;

    if (!image || !date || !title) {
      return res.status(400).json({ message: 'Image, date and title are required' });
    }

    const article = await Article.create({
      image,
      date,
      title,
      content: content || null,
      isMap: isMap === 'true' ? true : false,
    });

    // Fetch back with raw query to include content
    const results = await sequelize.query(
      'SELECT * FROM articles WHERE id = :id LIMIT 1',
      {
        replacements: { id: article.id },
        type: QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      message: 'Article created successfully',
      data: results[0],
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
    const { date, title, isMap, content } = req.body;
    const newImage = req.file ? `/uploads/articles/${req.file.filename}` : null;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await sequelize.query(
      `UPDATE articles SET
        image = :image,
        date = :date,
        title = :title,
        content = :content,
        isMap = :isMap,
        updatedAt = NOW()
       WHERE id = :id`,
      {
        replacements: {
          id,
          image: newImage ?? article.image,
          date: date ?? article.date,
          title: title ?? article.title,
          content: content ?? article.content ?? null,
          isMap: isMap === 'true' ? 1 : (article.isMap ? 1 : 0),
        },
        type: QueryTypes.UPDATE,
      }
    );

    const results = await sequelize.query(
      'SELECT * FROM articles WHERE id = :id LIMIT 1',
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    res.json({
      message: 'Article updated successfully',
      data: results[0],
    });
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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