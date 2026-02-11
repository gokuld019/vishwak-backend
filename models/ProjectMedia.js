// models/ProjectMedia.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectMedia = sequelize.define(
  "ProjectMedia",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cinematic360: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Stores ONLY google map URL now
    routeMap: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "project_media",
    timestamps: true,
  }
);

module.exports = ProjectMedia;
