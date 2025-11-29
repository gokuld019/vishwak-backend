const ConstructionUpdate = require('../models/ConstructionUpdate');

exports.getUpdatesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const items = await ConstructionUpdate.findAll({
      where: { projectId },
      order: [['date', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    console.error('Error getUpdatesByProject:', err);
    res.status(500).json({ message: 'Server error while fetching construction updates' });
  }
};

exports.createUpdate = async (req, res) => {
  try {
    const { projectId, date, update, progress } = req.body;
    const item = await ConstructionUpdate.create({ projectId, date, update, progress });
    res.status(201).json(item);
  } catch (err) {
    console.error('Error createUpdate:', err);
    res.status(500).json({ message: 'Server error while creating construction update' });
  }
};

exports.updateUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, update, progress } = req.body;

    const item = await ConstructionUpdate.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Construction update not found' });

    item.date = date ?? item.date;
    item.update = update ?? item.update;
    item.progress = progress ?? item.progress;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Error updateUpdate:', err);
    res.status(500).json({ message: 'Server error while updating construction update' });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ConstructionUpdate.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Construction update not found' });
    res.json({ message: 'Construction update deleted' });
  } catch (err) {
    console.error('Error deleteUpdate:', err);
    res.status(500).json({ message: 'Server error while deleting construction update' });
  }
};
