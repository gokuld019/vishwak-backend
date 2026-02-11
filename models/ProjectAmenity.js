const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectAmenity = sequelize.define(
  "ProjectAmenity",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // "text" or "image"
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "project_amenities",
    timestamps: true,
  }
);

module.exports = ProjectAmenity;
