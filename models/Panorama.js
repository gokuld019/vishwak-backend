const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Panorama = sequelize.define('Panorama', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  label: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. 'Site View', 'Tower A'
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false, // uploads/panorama/site.webp
  },

}, {
  tableName: 'project_panoramas',
  timestamps: true,
});

module.exports = Panorama;
