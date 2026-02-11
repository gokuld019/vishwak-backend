const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ConstructionUpdate = sequelize.define(
  "ConstructionUpdate",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: { type: DataTypes.INTEGER, allowNull: false },

    update: { type: DataTypes.STRING, allowNull: false },

    date: { type: DataTypes.DATEONLY, allowNull: false },

    progress: { type: DataTypes.INTEGER, allowNull: false },

    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "construction_updates",
    timestamps: true,
  }
);

module.exports = ConstructionUpdate;
