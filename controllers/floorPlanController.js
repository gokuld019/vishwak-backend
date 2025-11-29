const FloorPlan = require('../models/FloorPlan');

// GET /api/floor-plans/:projectId
exports.getFloorPlansByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const plans = await FloorPlan.findAll({ where: { projectId }, order: [['id', 'ASC']] });
    res.json(plans);
  } catch (err) {
    console.error('Error getFloorPlansByProject:', err);
    res.status(500).json({ message: 'Server error while fetching floor plans' });
  }
};

// POST /api/floor-plans
exports.createFloorPlan = async (req, res) => {
  try {
    const { projectId, type, area } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const plan = await FloorPlan.create({
      projectId,
      type,
      area,
      image: imagePath,
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error('Error createFloorPlan:', err);
    res.status(500).json({ message: 'Server error while creating floor plan' });
  }
};

// PUT /api/floor-plans/:id
exports.updateFloorPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, area } = req.body;

    const plan = await FloorPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: 'Floor plan not found' });

    if (req.file) {
      plan.image = `uploads/${req.file.filename}`;
    }

    plan.type = type ?? plan.type;
    plan.area = area ?? plan.area;

    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error('Error updateFloorPlan:', err);
    res.status(500).json({ message: 'Server error while updating floor plan' });
  }
};

// DELETE /api/floor-plans/:id
exports.deleteFloorPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FloorPlan.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Floor plan not found' });
    res.json({ message: 'Floor plan deleted' });
  } catch (err) {
    console.error('Error deleteFloorPlan:', err);
    res.status(500).json({ message: 'Server error while deleting floor plan' });
  }
};
