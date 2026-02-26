const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectNearbyPlace = sequelize.define(
  "ProjectNearbyPlace",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "railway",
        "bus",
        "metro",
        "area",
        "school",
        "college",
        "hospital",
        "it_park"
      ),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance_km: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    travel_time_minutes: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "project_nearby_places",
    timestamps: true,
  }
);

module.exports = ProjectNearbyPlace;