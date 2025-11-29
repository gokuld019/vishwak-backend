const Connectivity = require('../models/Connectivity');

exports.getConnectivityByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const rows = await Connectivity.findAll({
      where: { projectId },
      order: [['id', 'ASC']]
    });
    res.json(rows);
  } catch (err) {
    console.error('Error getConnectivityByProject:', err);
    res.status(500).json({ message: 'Server error while fetching connectivity' });
  }
};

exports.createConnectivity = async (req, res) => {
  try {
    const { projectId, name, distance, time } = req.body;
    const row = await Connectivity.create({ projectId, name, distance, time });
    res.status(201).json(row);
  } catch (err) {
    console.error('Error createConnectivity:', err);
    res.status(500).json({ message: 'Server error while creating connectivity' });
  }
};
