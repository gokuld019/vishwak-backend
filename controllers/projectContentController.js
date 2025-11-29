const ProjectContent = require('../models/ProjectContent');

// GET /api/project-content/:projectId
exports.getProjectContent = async (req, res) => {
  try {
    const { projectId } = req.params;
    const row = await ProjectContent.findOne({ where: { projectId } });
    if (!row) return res.json({ projectId, content: {} });
    res.json(row);
  } catch (err) {
    console.error('Error getProjectContent:', err);
    res.status(500).json({ message: 'Server error while fetching project content' });
  }
};

// POST /api/project-content
exports.upsertProjectContent = async (req, res) => {
  try {
    const { projectId, content } = req.body;

    let row = await ProjectContent.findOne({ where: { projectId } });

    if (!row) {
      row = await ProjectContent.create({ projectId, content });
    } else {
      row.content = content;
      await row.save();
    }

    res.json(row);
  } catch (err) {
    console.error('Error upsertProjectContent:', err);
    res.status(500).json({ message: 'Server error while saving project content' });
  }
};
