// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');

// GET all testimonials (public)
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['id', 'ASC']],
    });
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET testimonial by ID (admin)
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (err) {
    console.error('Error fetching testimonial:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE testimonial (admin)
exports.createTestimonial = async (req, res) => {
  try {
    const { text, author, rating } = req.body;

    if (!text || !author) {
      return res
        .status(400)
        .json({ message: 'Text and author are required' });
    }

    const testimonial = await Testimonial.create({
      text,
      author,
      rating: rating ?? 5,
    });

    res.status(201).json({
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE testimonial (admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author, rating } = req.body;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.update({
      text: text ?? testimonial.text,
      author: author ?? testimonial.author,
      rating: rating ?? testimonial.rating,
    });

    res.json({
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE testimonial (admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.destroy();

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
