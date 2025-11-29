const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FloorPlan = sequelize.define('FloorPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. '1 BHK', 'Studio'
  },

  area: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. '718 Sq.Ft'
  },

  // relative path: uploads/floorplans/xxx.webp
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  tableName: 'floor_plans',
  timestamps: true,
});

module.exports = FloorPlan;
