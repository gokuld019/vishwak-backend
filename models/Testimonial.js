// models/Testimonial.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Testimonial = sequelize.define(
  'Testimonial',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: 'testimonials',
    timestamps: true,
  }
);

module.exports = Testimonial;
