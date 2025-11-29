const Specification = require('../models/Specification');

exports.getSpecificationsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const specs = await Specification.findAll({ where: { projectId }, order: [['id', 'ASC']] });
    res.json(specs);
  } catch (err) {
    console.error('Error getSpecificationsByProject:', err);
    res.status(500).json({ message: 'Server error while fetching specifications' });
  }
};

exports.createSpecification = async (req, res) => {
  try {
    const { projectId, category, detail } = req.body;
    const spec = await Specification.create({ projectId, category, detail });
    res.status(201).json(spec);
  } catch (err) {
    console.error('Error createSpecification:', err);
    res.status(500).json({ message: 'Server error while creating specification' });
  }
};

exports.updateSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, detail } = req.body;

    const spec = await Specification.findByPk(id);
    if (!spec) return res.status(404).json({ message: 'Specification not found' });

    spec.category = category ?? spec.category;
    spec.detail = detail ?? spec.detail;
    await spec.save();
    res.json(spec);
  } catch (err) {
    console.error('Error updateSpecification:', err);
    res.status(500).json({ message: 'Server error while updating specification' });
  }
};

exports.deleteSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Specification.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Specification not found' });
    res.json({ message: 'Specification deleted' });
  } catch (err) {
    console.error('Error deleteSpecification:', err);
    res.status(500).json({ message: 'Server error while deleting specification' });
  }
};
