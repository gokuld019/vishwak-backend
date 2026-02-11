const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PriceList = sequelize.define(
  "PriceList",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: { type: DataTypes.INTEGER, allowNull: false },

    unit: { type: DataTypes.STRING, allowNull: false },   

    price: { type: DataTypes.STRING, allowNull: false },  
  },
  {
    tableName: "price_list",
    timestamps: true,
  }
);

module.exports = PriceList;
