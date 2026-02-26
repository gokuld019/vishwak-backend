const AvailablePlot = require("../models/AvailablePlot");

/* =========================================
   GET AVAILABLE PLOTS BY PROJECT
========================================= */
exports.getAvailablePlots = async (req, res) => {
  try {
    const { projectId } = req.params;

    const plots = await AvailablePlot.findAll({
      where: { projectId },
      order: [["plotNumber", "ASC"]],
    });

    res.json({ success: true, data: plots });

  } catch (err) {
    console.error("Available plots error:", err);
    res.status(500).json({ success: false });
  }
};