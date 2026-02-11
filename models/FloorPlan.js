const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FloorPlan = sequelize.define(
  "FloorPlan",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "floor_plans",
    timestamps: true,
  }
);

module.exports = FloorPlan;
