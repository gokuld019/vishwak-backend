const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {

    const { name, email, phone, inquiry, projectId, message } = req.body;

    const saved = await Contact.create({
      name,
      email,
      phone,
      inquiry,
      projectId,
      message,
      leadSource: "Website Enquiry"
    });

    res.json({
      success: true,
      data: saved
    });

  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

module.exports = router;