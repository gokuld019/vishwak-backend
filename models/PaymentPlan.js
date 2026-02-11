// models/PaymentPlan.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentPlan = sequelize.define(
  "PaymentPlan",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "payment_plans",
    timestamps: true,
  }
);

module.exports = PaymentPlan;
