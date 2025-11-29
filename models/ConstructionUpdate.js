const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConstructionUpdate = sequelize.define('ConstructionUpdate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  update: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  progress: {
    type: DataTypes.INTEGER, // 0–100
    allowNull: false,
  },

}, {
  tableName: 'construction_updates',
  timestamps: true,
});

module.exports = ConstructionUpdate;
