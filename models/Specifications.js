// models/Specifications.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Projects");

const Specification = sequelize.define(
  "Specification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    category: {
      // e.g. "Flooring", "Kitchen", "Bathroom"
      type: DataTypes.STRING,
      allowNull: false,
    },

    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "specifications",
    timestamps: true,
  }
);

Project.hasMany(Specification, {
  foreignKey: "projectId",
  as: "specifications",
});
Specification.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

module.exports = Specification;
