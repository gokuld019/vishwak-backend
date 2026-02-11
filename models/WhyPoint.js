// models/WhyPoint.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WhyPoint = sequelize.define(
  "WhyPoint",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    // Link to the main Project (same projectId you're using everywhere)
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Card title – e.g., "Prime Location"
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Card description – e.g., "Strategic location on GST Road..."
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Which icon to show on frontend – e.g., "MapPin", "Building2"
    iconKey: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "MapPin",
    },

    // For ordering in grid (1, 2, 3, 4...)
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "why_points",
    timestamps: true,
  }
);

module.exports = WhyPoint;
