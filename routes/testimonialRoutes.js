const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
router.post('/', auth(), (req, res, next) => {
  console.log("🔥 Entered POST /api/testimonials route");
  next();
}, createTestimonial);

// Public
router.get('/', getTestimonials);

// Admin
router.get('/:id', auth(), getTestimonialById);
router.post('/', auth(), createTestimonial);
router.put('/:id', auth(), updateTestimonial);
router.delete('/:id', auth(), deleteTestimonial);

module.exports = router;
