// models/Commercial.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Commercial = sequelize.define(
  'Commercial',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    // 'buy' | 'lease'
    type: {
      type: DataTypes.ENUM('buy', 'lease'),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'commercial_spaces',
    timestamps: true,
  }
);

module.exports = Commercial;
