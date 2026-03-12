const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  submitContact,
  getContacts,
  getContactById,
  deleteContact,
  submitWidgetLead   
} = require('../controllers/contactController');


router.post("/widget-lead", submitWidgetLead);   // ⭐ FIRST

router.post('/', submitContact);

router.get('/', auth, getContacts);

router.get('/:id', auth, getContactById);

router.delete('/:id', auth, deleteContact);

module.exports = router;
