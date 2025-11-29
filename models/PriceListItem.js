const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PriceListItem = sequelize.define('PriceListItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  unit: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. 'Studio - 718 Sq.Ft'
  },

  price: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. '₹45 Lakhs'
  },

}, {
  tableName: 'price_list_items',
  timestamps: true,
});

module.exports = PriceListItem;
