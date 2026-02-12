// =========================================================
// config/db.js
// Sequelize Database Configuration
// Works for Local (XAMPP) + Aiven (Production)
// =========================================================

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,

    // ✅ SSL only for Aiven / Production
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},

    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
