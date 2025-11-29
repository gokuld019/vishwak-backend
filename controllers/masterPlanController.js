const MasterPlan = require('../models/MasterPlan');

exports.getMasterPlanByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const mp = await MasterPlan.findOne({ where: { projectId } });
    if (!mp) return res.json([]);
    res.json([mp]); // frontend expects array and uses [0]
  } catch (err) {
    console.error('Error getMasterPlanByProject:', err);
    res.status(500).json({ message: 'Server error while fetching master plan' });
  }
};

exports.upsertMasterPlan = async (req, res) => {
  try {
    const { projectId, description } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    let mp = await MasterPlan.findOne({ where: { projectId } });

    if (!mp) {
      if (!imagePath) {
        return res.status(400).json({ message: 'Image is required for new master plan' });
      }
      mp = await MasterPlan.create({ projectId, image: imagePath, description });
    } else {
      if (imagePath) mp.image = imagePath;
      mp.description = description ?? mp.description;
      await mp.save();
    }

    res.json(mp);
  } catch (err) {
    console.error('Error upsertMasterPlan:', err);
    res.status(500).json({ message: 'Server error while saving master plan' });
  }
};
