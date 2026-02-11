// models/Job.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define(
  "Job",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dept: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING, // Full-time, Part-time, etc.
      allowNull: false,
    },

    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // store tags as JSON array: ["Sales", "Real Estate"]
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

module.exports = Job;
