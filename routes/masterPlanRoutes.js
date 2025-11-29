const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getMasterPlanByProject,
  upsertMasterPlan,
} = require('../controllers/masterPlanController');

router.get('/:projectId', getMasterPlanByProject);
router.post('/', upload.single('image'), upsertMasterPlan);

module.exports = router;
