const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  submitContact,
  getContacts,
  getContactById,
  deleteContact,
} = require('../controllers/contactController');

// Public
router.post('/', submitContact);

// Admin
router.get('/', auth, getContacts);
router.get('/:id', auth, getContactById);
router.delete('/:id', auth, deleteContact);

module.exports = router;
