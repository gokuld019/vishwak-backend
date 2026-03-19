const Contact = require("../models/Contact");
const sendWhatsAppLead = require("../utils/sendWhatsApp");
const sendLeadToCRM = require("../utils/sendToCRM");

// ==============================
// PUBLIC: WEBSITE ENQUIRY
// ==============================
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, inquiry, projectId, message } = req.body;

if (!name || !phone) {
  return res.status(400).json({
    success: false,
    message: "Name and phone are required",
  });
}

// ⭐ PHONE VALIDATION
const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(phone)) {
  return res.status(400).json({
    success: false,
    message:
      "Enter valid 10 digit Indian mobile number starting with 6,7,8 or 9",
  });
}

    // ⭐ SAVE DB
    const saved = await Contact.create({
      name,
      email,
      phone,
      inquiry,
      projectId,
      message,
      leadSource: "Website Enquiry",
    });

    // ⭐ SEND WHATSAPP (ADMIN)
    try {
      await sendWhatsAppLead({
        name,
        phone,
        message: inquiry || message || "Website Enquiry",
      });
    } catch (err) {
      console.log("⚠ WhatsApp Send Failed:", err.message);
    }

    // ⭐ PUSH TO CRM
    try {
      await sendLeadToCRM({
        name,
        email,
        phone,
        message: inquiry || message || "Website Enquiry",
      });
    } catch (err) {
      console.log("⚠ CRM Push Failed:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Submit Contact Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// ADMIN: GET ALL
// ==============================
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(contacts);
  } catch (err) {
    console.error("Fetch Contacts Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// ADMIN: GET SINGLE
// ==============================
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// ADMIN: DELETE
// ==============================
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// OTP BROCHURE LEAD
// ==============================
exports.submitWidgetLead = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

if (!phone) {
  return res.status(400).json({
    success: false,
    message: "Phone missing",
  });
}

const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(phone)) {
  return res.status(400).json({
    success: false,
    message:
      "Enter valid 10 digit Indian mobile number starting with 6,7,8 or 9",
  });
}

    // ⭐ SAVE DB
    const saved = await Contact.create({
      name: name || "Brochure User",
      email: "otp@lead.com",
      phone,
      location,
      leadSource: "OTP Brochure",
      inquiry: "Brochure Download",
    });

    // ⭐ SEND WHATSAPP
    try {
      await sendWhatsAppLead({
        name: name || "Brochure User",
        phone,
        message: "Brochure Download Lead",
      });
    } catch (err) {
      console.log("⚠ WhatsApp Failed:", err.message);
    }

    // ⭐ PUSH TO CRM
    try {
      await sendLeadToCRM({
        name: name || "Brochure User",
        email: "",
        phone,
        message: "Brochure Download Lead",
      });
    } catch (err) {
      console.log("⚠ CRM Push Failed:", err.message);
    }

    res.json({
      success: true,
      data: saved,
    });
  } catch (err) {
    console.log("Widget Lead Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};