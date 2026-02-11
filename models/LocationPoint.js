const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LocationPoint = sequelize.define(
  "LocationPoint",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // type = 'connectivity' OR 'facility'
    type: {
      type: DataTypes.ENUM("connectivity", "facility"),
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    distance: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "location_points",
    timestamps: true,
  }
);

module.exports = LocationPoint;
