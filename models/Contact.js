const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contact = sequelize.define(
  "Contact",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING, allowNull: false },

    email: { type: DataTypes.STRING, allowNull: true },

    phone: { type: DataTypes.STRING, allowNull: false },

    inquiry: { type: DataTypes.STRING },

    projectId: { type: DataTypes.INTEGER },

    message: { type: DataTypes.TEXT },

    location: { type: DataTypes.STRING },

    leadSource: { type: DataTypes.STRING },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);

module.exports = Contact;