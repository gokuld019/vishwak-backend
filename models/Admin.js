// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Super Admin' },
email: { type: DataTypes.STRING, allowNull: false, unique: false },
  password: { type: DataTypes.STRING, allowNull: false }, // hashed
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'admins' });

module.exports = Admin;
