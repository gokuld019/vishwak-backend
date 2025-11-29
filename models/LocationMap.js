const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LocationMap = sequelize.define('LocationMap', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },

  mapImage: {
    type: DataTypes.STRING,
    allowNull: true, // e.g. uploads/maps/xxx.png
  },

  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

  address: { type: DataTypes.STRING, allowNull: true },

}, {
  tableName: 'location_maps',
  timestamps: true,
});

module.exports = LocationMap;
