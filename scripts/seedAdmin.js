// scripts/seedAdmin.js
require('dotenv').config({ path: __dirname + '/../.env' });
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const Admin = require('../models/Admin');

(async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
console.log("Using DB:", process.env.DB_NAME);
console.log("Admin Email:", process.env.ADMIN_EMAIL);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
      process.exit(1);
    }

    const found = await Admin.findOne({ where: { email } });
    if (found) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);
    await Admin.create({ name: 'Super Admin', email, password: hash, role: 'admin' });
    console.log('✅ Default Admin Created Successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
})();
