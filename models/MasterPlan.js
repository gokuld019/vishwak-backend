const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MasterPlan = sequelize.define('MasterPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // one master plan per project
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: 'master_plans',
  timestamps: true,
});

module.exports = MasterPlan;
