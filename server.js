// server.js - Vishwak Properties Backend
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Database
const sequelize = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const bannerRoutes = require("./routes/bannerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const articleRoutes = require("./routes/articleRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const commercialRoutes = require("./routes/commercialRoutes");
const contactRoutes = require("./routes/contactRoutes");
const floorPlanRoutes = require('./routes/floorPlanRoutes');
const projectAmenityRoutes = require('./routes/projectAmenityRoutes');
const specificationRoutes = require('./routes/specificationRoutes');
const constructionUpdateRoutes = require('./routes/constructionUpdateRoutes');
const priceListRoutes = require('./routes/priceListRoutes');
const projectGalleryRoutes = require('./routes/projectGalleryRoutes');
const masterPlanRoutes = require('./routes/masterPlanRoutes');
const locationMapRoutes = require('./routes/locationMapRoutes');
const connectivityRoutes = require('./routes/connectivityRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const panoramaRoutes = require('./routes/panoramaRoutes');
const projectContentRoutes = require('./routes/projectContentRoutes');



const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files (Images / Uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// CORS CONFIG
// ======================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================
// API ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/commercial", commercialRoutes);
app.use("/api/contact", contactRoutes);
// Project details APIs for ProjectDetailsPage

app.use('/api/floor-plans', floorPlanRoutes);
app.use('/api/amenities', projectAmenityRoutes);      // if NO conflict; else use '/api/project-amenities'
app.use('/api/specifications', specificationRoutes);
app.use('/api/construction-updates', constructionUpdateRoutes);
app.use('/api/price-list', priceListRoutes);
app.use('/api/gallery', projectGalleryRoutes);
app.use('/api/master-plan', masterPlanRoutes);
app.use('/api/location-map', locationMapRoutes);
app.use('/api/connectivity', connectivityRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/panoramas', panoramaRoutes);
app.use('/api/project-content', projectContentRoutes);



// Health Check
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend Running 🚀" });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("⏳ Connecting to MySQL...");
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    console.log("🔄 Syncing models...");
    await sequelize.sync({ alter: true, logging: false });
    console.log("✅ Models synced");

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
