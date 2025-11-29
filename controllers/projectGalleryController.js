const ProjectGalleryImage = require('../models/ProjectGalleryImage');

exports.getGalleryByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const images = await ProjectGalleryImage.findAll({
      where: { projectId },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']]
    });
    res.json(images);
  } catch (err) {
    console.error('Error getGalleryByProject:', err);
    res.status(500).json({ message: 'Server error while fetching gallery' });
  }
};

exports.createGalleryImage = async (req, res) => {
  try {
    const { projectId, altText, sortOrder } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    if (!imagePath) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const img = await ProjectGalleryImage.create({
      projectId,
      image: imagePath,
      altText,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json(img);
  } catch (err) {
    console.error('Error createGalleryImage:', err);
    res.status(500).json({ message: 'Server error while creating gallery image' });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProjectGalleryImage.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Gallery image not found' });
    res.json({ message: 'Gallery image deleted' });
  } catch (err) {
    console.error('Error deleteGalleryImage:', err);
    res.status(500).json({ message: 'Server error while deleting gallery image' });
  }
};
