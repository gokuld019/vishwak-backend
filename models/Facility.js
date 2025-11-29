const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Facility = sequelize.define('Facility', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  text: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. 'Fortis Hospital - 3 km'
  },

}, {
  tableName: 'project_facilities',
  timestamps: true,
});

module.exports = Facility;
