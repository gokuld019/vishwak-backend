const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Why = sequelize.define("Why", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  iconKey: {
    type: DataTypes.STRING,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: "why_points",
  timestamps: true,
});

module.exports = Why;