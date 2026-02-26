const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectAmenity = sequelize.define(
  "ProjectAmenity",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text", // Only text now
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "project_amenities",
    timestamps: true,
  }
);

module.exports = ProjectAmenity;