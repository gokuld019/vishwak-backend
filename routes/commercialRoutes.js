const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getCommercialSpaces,
  getCommercialById,
  createCommercialSpace,
  updateCommercialSpace,
  deleteCommercialSpace,
} = require('../controllers/commercialController');

// Public
router.get('/', getCommercialSpaces);

// Admin
router.get('/:id', auth, getCommercialById);
router.post('/', auth, createCommercialSpace);
router.put('/:id', auth, updateCommercialSpace);
router.delete('/:id', auth, deleteCommercialSpace);

module.exports = router;
