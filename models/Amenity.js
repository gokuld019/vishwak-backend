// models/Amenity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Amenity = sequelize.define(
  'Amenity',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    icon: {
      type: DataTypes.STRING,
      allowNull: true, // e.g. '/uploads/amenities/amenity_123.png'
    },

    label: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. 'MEDITATION AREA'
    },
  },
  {
    tableName: 'amenities',
    timestamps: true,
  }
);

module.exports = Amenity;
