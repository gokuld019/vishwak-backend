// models/Amenities.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Projects");

const Amenity = sequelize.define(
  "Amenity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    projectId: {
      // If null => global/homepage amenity
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Project,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Optional – you can store icon filename or class
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Optional description
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "amenities",
    timestamps: true,
  }
);

// Associations
Project.hasMany(Amenity, {
  foreignKey: "projectId",
  as: "amenities",
});
Amenity.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

module.exports = Amenity;
