// models/RefreshToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Admin = require('./Admin');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.TEXT, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  ip: { type: DataTypes.STRING, allowNull: true },
  userAgent: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'refresh_tokens' });

RefreshToken.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Admin.hasMany(RefreshToken, { foreignKey: 'adminId' });

module.exports = RefreshToken;
