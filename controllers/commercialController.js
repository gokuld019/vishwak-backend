// controllers/commercialController.js
const Commercial = require('../models/Commercial');

// GET all commercial spaces (public, supports ?type=buy/lease)
exports.getCommercialSpaces = async (req, res) => {
  try {
    const { type } = req.query; // buy / lease
    const where = {};
    if (type) where.type = type;

    const spaces = await Commercial.findAll({
      where,
      order: [['id', 'ASC']],
    });

    res.json(spaces);
  } catch (err) {
    console.error('Error fetching commercial spaces:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single commercial space (admin/edit or detail)
exports.getCommercialById = async (req, res) => {
  try {
    const space = await Commercial.findByPk(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }
    res.json(space);
  } catch (err) {
    console.error('Error fetching commercial space:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE commercial space (admin)
exports.createCommercialSpace = async (req, res) => {
  try {
    const { type, title, subtitle, image, description } = req.body;

    if (!type || !title || !image) {
      return res
        .status(400)
        .json({ message: 'Type, title and image are required' });
    }

    const space = await Commercial.create({
      type,
      title,
      subtitle,
      image,
      description,
    });

    res.status(201).json({
      message: 'Commercial space created successfully',
      data: space,
    });
  } catch (err) {
    console.error('Error creating commercial space:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE commercial space (admin)
exports.updateCommercialSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, subtitle, image, description } = req.body;

    const space = await Commercial.findByPk(id);
    if (!space) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    await space.update({
      type: type ?? space.type,
      title: title ?? space.title,
      subtitle: subtitle ?? space.subtitle,
      image: image ?? space.image,
      description: description ?? space.description,
    });

    res.json({
      message: 'Commercial space updated successfully',
      data: space,
    });
  } catch (err) {
    console.error('Error updating commercial space:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE commercial space (admin)
exports.deleteCommercialSpace = async (req, res) => {
  try {
    const { id } = req.params;

    const space = await Commercial.findByPk(id);
    if (!space) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    await space.destroy();

    res.json({ message: 'Commercial space deleted successfully' });
  } catch (err) {
    console.error('Error deleting commercial space:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
