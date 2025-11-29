// models/Contact.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define(
  'Contact',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inquiry: {
      type: DataTypes.STRING,
      allowNull: true, // apartments / villas / plots / commercial / general, etc.
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'contacts',
    timestamps: true, // createdAt = lead time
  }
);

module.exports = Contact;
