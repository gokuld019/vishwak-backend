const SmartInvestment = require("../models/SmartInvestment");

// CREATE / UPDATE
exports.saveSmartInvestment = async (req, res) => {
  try {
    const { projectId, titleLine1, titleLine2, highlightText, tagline, mainDescription } = req.body;

    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    let record = await SmartInvestment.findOne({ where: { projectId } });

    if (record) {
      await record.update({ titleLine1, titleLine2, highlightText, tagline, mainDescription });
    } else {
      record = await SmartInvestment.create({ projectId, titleLine1, titleLine2, highlightText, tagline, mainDescription });
    }

    res.json({ message: "Smart Investment section saved", data: record });
  } catch (error) {
    console.error("Smart Investment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET
exports.getSmartInvestment = async (req, res) => {
  try {
    const { projectId } = req.params;

    const record = await SmartInvestment.findOne({ where: { projectId } });

    if (!record) return res.json({});

    res.json(record);
  } catch (error) {
    console.error("Fetch Smart Investment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
