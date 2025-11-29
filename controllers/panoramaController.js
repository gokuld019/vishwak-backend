const Panorama = require('../models/Panorama');

exports.getPanoramasByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const rows = await Panorama.findAll({
      where: { projectId },
      order: [['id', 'ASC']]
    });
    res.json(rows);
  } catch (err) {
    console.error('Error getPanoramasByProject:', err);
    res.status(500).json({ message: 'Server error while fetching panoramas' });
  }
};

exports.createPanorama = async (req, res) => {
  try {
    const { projectId, label } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;
    if (!imagePath) {
      return res.status(400).json({ message: 'Panorama image is required' });
    }
    const row = await Panorama.create({ projectId, label, image: imagePath });
    res.status(201).json(row);
  } catch (err) {
    console.error('Error createPanorama:', err);
    res.status(500).json({ message: 'Server error while creating panorama' });
  }
};
