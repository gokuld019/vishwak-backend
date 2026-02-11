const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SmartInvestment = sequelize.define("SmartInvestment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  titleLine1: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  titleLine2: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  highlightText: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  mainDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  tagline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SmartInvestment;
