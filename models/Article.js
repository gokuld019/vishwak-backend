// models/Article.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Article = sequelize.define(
  'Article',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'articles',
    timestamps: true,
  }
);

module.exports = Article;
