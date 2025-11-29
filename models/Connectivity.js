const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Connectivity = sequelize.define('Connectivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  distance: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  tableName: 'connectivity_points',
  timestamps: true,
});

module.exports = Connectivity;
