// controllers/contactController.js
const Contact = require('../models/Contact');

// PUBLIC: submit contact/enquiry
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, inquiry, message } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: 'Name, email and phone are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      inquiry,
      message,
    });

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      data: contact,
    });
  } catch (err) {
    console.error('Error submitting contact:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: get all enquiries (with optional pagination)
exports.getContacts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: get single enquiry
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: delete enquiry
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.destroy();

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
