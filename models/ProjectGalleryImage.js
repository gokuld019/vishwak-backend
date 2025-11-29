const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectGalleryImage = sequelize.define('ProjectGalleryImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false, // uploads/gallery/xxx.jpg
  },

  altText: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

}, {
  tableName: 'project_gallery_images',
  timestamps: true,
});

module.exports = ProjectGalleryImage;
