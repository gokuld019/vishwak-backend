const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Brochure = sequelize.define(
  "Brochure",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "brochures",
    timestamps: true,
  }
);

module.exports = Brochure;
