const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Specification = sequelize.define('Specification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. 'Flooring'
  },

  detail: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

}, {
  tableName: 'project_specifications',
  timestamps: true,
});

module.exports = Specification;
