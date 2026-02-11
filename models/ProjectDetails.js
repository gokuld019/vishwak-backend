const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // ✅ THIS WAS MISSING

const ProjectDetails = sequelize.define(
  "ProjectDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
    },

    tagline: {
      type: DataTypes.STRING,
    },

    heroTag: {
      type: DataTypes.STRING,
    },

    // ⭐ SEPARATE HERO BANNERS
    heroImageDesktop: {
      type: DataTypes.STRING,
    },

    heroImageMobile: {
      type: DataTypes.STRING,
    },

    category: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("ongoing", "completed"),
      defaultValue: "ongoing",
    },

    type: {
      type: DataTypes.STRING,
    },

    developmentSize: {
      type: DataTypes.STRING,
    },

    numberOfUnits: {
      type: DataTypes.STRING,
    },

    topTitle: {
      type: DataTypes.STRING,
    },

    topSubtitle: {
      type: DataTypes.STRING,
    },

    topLocation: {
      type: DataTypes.STRING,
    },

    topDescription: {
      type: DataTypes.TEXT,
    },

    image1: {
      type: DataTypes.STRING,
    },

    image2: {
      type: DataTypes.STRING,
    },

    image3: {
      type: DataTypes.STRING,
    },

    image4: {
      type: DataTypes.STRING,
    },

    thumbnail: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "project_details",
    timestamps: true,
  }
);

module.exports = ProjectDetails;
