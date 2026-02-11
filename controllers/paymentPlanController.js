// controllers/paymentPlanController.js
const PaymentPlan = require("../models/PaymentPlan");

// ADD MULTIPLE PAYMENT PLAN ROWS
exports.addPaymentPlan = async (req, res) => {
  try {
    console.log("PaymentPlan Body:", req.body);

    let { projectId, items } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    if (!items) {
      return res.status(400).json({ message: "items is required" });
    }

    // If coming as string (form-data), parse JSON
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

    const created = [];

    for (const item of items) {
      const row = await PaymentPlan.create({
        projectId,
        stage: item.stage,
        amount: item.amount,
      });
      created.push(row);
    }

    return res.json({
      message: "Payment Plan added successfully",
      paymentPlan: created,
    });
  } catch (err) {
    console.error("PaymentPlan error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET PAYMENT PLAN BY PROJECT
exports.getPaymentPlan = async (req, res) => {
  try {
    const { projectId } = req.params;

    const list = await PaymentPlan.findAll({
      where: { projectId },
      order: [["id", "ASC"]],
    });

    res.json({ paymentPlan: list });
  } catch (err) {
    console.error("Fetch PaymentPlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE SINGLE PAYMENT PLAN ROW
exports.updatePaymentItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, amount } = req.body;

    const item = await PaymentPlan.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.stage = stage || item.stage;
    item.amount = amount || item.amount;

    await item.save();

    res.json({ message: "Updated successfully", data: item });
  } catch (err) {
    console.error("Update PaymentPlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PAYMENT PLAN ROW
exports.deletePaymentItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PaymentPlan.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete PaymentPlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
