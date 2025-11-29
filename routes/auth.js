// routes/auth.js
const router = require('express').Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/authController');

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password required')
  ],
  authCtrl.login
);

router.post('/refresh', authCtrl.refresh);
router.post('/logout', authCtrl.logout);

module.exports = router;
