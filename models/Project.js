// models/Project.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define(
  'Project',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },

    category: {
      type: DataTypes.ENUM('apartments', 'villas', 'plots'),
      allowNull: false,
    },

    image: { type: DataTypes.STRING, allowNull: true },

    totalUnits: { type: DataTypes.STRING, allowNull: true },
    bedrooms: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'projects',
    timestamps: true,
  }
);

module.exports = Project;
