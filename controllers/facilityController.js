const Facility = require('../models/Facility');

exports.getFacilitiesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const rows = await Facility.findAll({
      where: { projectId },
      order: [['id', 'ASC']]
    });
    res.json(rows);
  } catch (err) {
    console.error('Error getFacilitiesByProject:', err);
    res.status(500).json({ message: 'Server error while fetching facilities' });
  }
};

exports.createFacility = async (req, res) => {
  try {
    const { projectId, text } = req.body;
    const row = await Facility.create({ projectId, text });
    res.status(201).json(row);
  } catch (err) {
    console.error('Error createFacility:', err);
    res.status(500).json({ message: 'Server error while creating facility' });
  }
};
