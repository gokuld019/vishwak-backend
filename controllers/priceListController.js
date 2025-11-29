const PriceListItem = require('../models/PriceListItem');

exports.getPriceListByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const items = await PriceListItem.findAll({
      where: { projectId },
      order: [['id', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    console.error('Error getPriceListByProject:', err);
    res.status(500).json({ message: 'Server error while fetching price list' });
  }
};

exports.createPriceItem = async (req, res) => {
  try {
    const { projectId, unit, price } = req.body;
    const item = await PriceListItem.create({ projectId, unit, price });
    res.status(201).json(item);
  } catch (err) {
    console.error('Error createPriceItem:', err);
    res.status(500).json({ message: 'Server error while creating price item' });
  }
};

exports.updatePriceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit, price } = req.body;

    const item = await PriceListItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Price item not found' });

    item.unit = unit ?? item.unit;
    item.price = price ?? item.price;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Error updatePriceItem:', err);
    res.status(500).json({ message: 'Server error while updating price item' });
  }
};

exports.deletePriceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PriceListItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Price item not found' });
    res.json({ message: 'Price item deleted' });
  } catch (err) {
    console.error('Error deletePriceItem:', err);
    res.status(500).json({ message: 'Server error while deleting price item' });
  }
};
