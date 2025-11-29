const express = require('express');
const router = express.Router();
const {
  getPriceListByProject,
  createPriceItem,
  updatePriceItem,
  deletePriceItem,
} = require('../controllers/priceListController');

router.get('/:projectId', getPriceListByProject);
router.post('/', createPriceItem);
router.put('/:id', updatePriceItem);
router.delete('/:id', deletePriceItem);

module.exports = router;
