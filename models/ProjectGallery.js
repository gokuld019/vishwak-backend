const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectGallery = sequelize.define(
  "ProjectGallery",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "projectgalleries",   // ✅ IMPORTANT
    freezeTableName: true,           // ✅ VERY IMPORTANT
    timestamps: true,
  }
);

module.exports = ProjectGallery;