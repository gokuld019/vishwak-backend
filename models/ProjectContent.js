const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectContent = sequelize.define('ProjectContent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Single JSON blob that can store:
  // overview, whyAira, smartInvestment, galleryText, stats, etc.
  content: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  }
}, {
  tableName: 'project_contents',
  timestamps: true,
});

module.exports = ProjectContent;
