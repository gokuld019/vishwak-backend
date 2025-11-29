const express = require('express');
const router = express.Router();
const {
  getConnectivityByProject,
  createConnectivity,
} = require('../controllers/connectivityController');

router.get('/:projectId', getConnectivityByProject);
router.post('/', createConnectivity);

module.exports = router;
