const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectStats = sequelize.define("ProjectStats", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  totalUnits: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  sqftRange: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  saleableArea: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  floors: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  badgeText: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "BANG ON GST ROAD",
  },
});

module.exports = ProjectStats;
