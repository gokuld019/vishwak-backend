const PriceList = require("../models/PriceList");

exports.addPriceList = async (req, res) => {
  try {
    console.log("Body received:", req.body);

    let { projectId, items } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    if (!items) {
      return res.status(400).json({ message: "items is required" });
    }

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (err) {
        return res.status(400).json({ message: "items must be valid JSON array" });
      }
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array" });
    }

    let created = [];

    for (const item of items) {
      const entry = await PriceList.create({
        projectId,
        unit: item.unit,
        price: item.price,
      });
      created.push(entry);
    }

    return res.json({
      message: "Price List added successfully",
      priceList: created,
    });

  } catch (err) {
    console.error("Price list error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET PRICE LIST
exports.getPriceList = async (req, res) => {
  try {
    const { projectId } = req.params;

    const list = await PriceList.findAll({
      where: { projectId },
      order: [["id", "ASC"]],
    });

    res.json({ priceList: list });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PRICE ROW (correct name)
exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit, price } = req.body;

    const item = await PriceList.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.unit = unit || item.unit;
    item.price = price || item.price;

    await item.save();

    res.json({ message: "Updated successfully", data: item });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PRICE ROW (correct name)
exports.deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PriceList.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
