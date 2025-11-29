const ProjectAmenity = require('../models/ProjectAmenity');

// GET /api/amenities/:projectId
exports.getAmenitiesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const items = await ProjectAmenity.findAll({ where: { projectId }, order: [['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    console.error('Error getAmenitiesByProject:', err);
    res.status(500).json({ message: 'Server error while fetching amenities' });
  }
};

// POST /api/amenities
exports.createAmenity = async (req, res) => {
  try {
    const { projectId, name } = req.body;
    const amenity = await ProjectAmenity.create({ projectId, name });
    res.status(201).json(amenity);
  } catch (err) {
    console.error('Error createAmenity:', err);
    res.status(500).json({ message: 'Server error while creating amenity' });
  }
};

// PUT /api/amenities/:id
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const amenity = await ProjectAmenity.findByPk(id);
    if (!amenity) return res.status(404).json({ message: 'Amenity not found' });

    amenity.name = name ?? amenity.name;
    await amenity.save();
    res.json(amenity);
  } catch (err) {
    console.error('Error updateAmenity:', err);
    res.status(500).json({ message: 'Server error while updating amenity' });
  }
};

// DELETE /api/amenities/:id
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProjectAmenity.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Amenity not found' });
    res.json({ message: 'Amenity deleted' });
  } catch (err) {
    console.error('Error deleteAmenity:', err);
    res.status(500).json({ message: 'Server error while deleting amenity' });
  }
};
