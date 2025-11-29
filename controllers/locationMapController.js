const LocationMap = require('../models/LocationMap');

exports.getLocationMapByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const lm = await LocationMap.findOne({ where: { projectId } });
    if (!lm) return res.json([]);
    res.json([lm]); // keep same pattern as masterPlan
  } catch (err) {
    console.error('Error getLocationMapByProject:', err);
    res.status(500).json({ message: 'Server error while fetching location map' });
  }
};

exports.upsertLocationMap = async (req, res) => {
  try {
    const { projectId, latitude, longitude, address } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    let lm = await LocationMap.findOne({ where: { projectId } });

    if (!lm) {
      lm = await LocationMap.create({
        projectId,
        mapImage: imagePath,
        latitude,
        longitude,
        address,
      });
    } else {
      if (imagePath) lm.mapImage = imagePath;
      lm.latitude = latitude ?? lm.latitude;
      lm.longitude = longitude ?? lm.longitude;
      lm.address = address ?? lm.address;
      await lm.save();
    }

    res.json(lm);
  } catch (err) {
    console.error('Error upsertLocationMap:', err);
    res.status(500).json({ message: 'Server error while saving location map' });
  }
};
