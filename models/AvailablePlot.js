const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AvailablePlot = sequelize.define(
  "AvailablePlot",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    slNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    plotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    sqft: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "available_plots",
    timestamps: true,
  }
);

module.exports = AvailablePlot;