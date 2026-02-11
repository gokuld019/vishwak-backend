const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FloorPlanEnquiry = sequelize.define(
  "FloorPlanEnquiry",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: { type: DataTypes.INTEGER, allowNull: false },

    floorPlanId: { type: DataTypes.INTEGER, allowNull: false },

    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    interestedIn: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "floor_plan_enquiries",
    timestamps: true,
  }
);

module.exports = FloorPlanEnquiry;
