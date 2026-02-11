const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define(
  'Banner',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    image: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. '/uploads/banners/hero1.webp' OR external URL
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    highlight: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ⭐ NEW FIELD
    deviceType: {
      type: DataTypes.ENUM("web", "mobile"),
      allowNull: false,
      defaultValue: "web", // old banners will be treated as web
    },
  },
  {
    tableName: 'banners',
    timestamps: true,
  }
);

module.exports = Banner;
