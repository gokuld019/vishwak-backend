// models/JobApplication.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Job = require("./Job");

const JobApplication = sequelize.define(
  "JobApplication",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resumePath: {
      type: DataTypes.STRING, // e.g. /uploads/resumes/xyz.pdf
      allowNull: true,
    },
  },
  {
    tableName: "job_applications",
    timestamps: true,
  }
);

Job.hasMany(JobApplication, { foreignKey: "jobId", as: "applications" });
JobApplication.belongsTo(Job, { foreignKey: "jobId", as: "job" });

module.exports = JobApplication;
