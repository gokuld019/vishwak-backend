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
const projectDetailsRoutes = require("./routes/projectDetailsRoutes");
const brochureRoutes = require("./routes/brochureRoutes");
const projectMenuRoutes = require("./routes/projectMenuRoutes");
const whyRoutes = require("./routes/whyRoutes");
const locationRoutes = require("./routes/locationRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");
const projectAmenityRoutes = require("./routes/projectAmenityRoutes");
const specificationRoutes = require("./routes/specificationRoutes");
const constructionUpdateRoutes = require("./routes/constructionUpdateRoutes");
const priceListRoutes = require("./routes/priceListRoutes");
const paymentPlanRoutes = require("./routes/paymentPlanRoutes");
const smartInvestmentRoutes = require("./routes/smartInvestmentRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const projectStatsRoutes = require("./routes/projectStatsRoutes");
const projectMediaRoutes = require("./routes/projectMediaRoutes");
const careerRoutes = require("./routes/careerRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");

const app = express();

// =========================================================
// GLOBAL MIDDLEWARE
// =========================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================================================
// CORS CONFIG (LOCAL + VERCEL)
// =========================================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL, // add Vercel URL here
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================================================
// STATIC FILES
// =========================================================
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================================================
// API ROUTES
// =========================================================
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/projects/menu", projectMenuRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/commercial", commercialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/brochure", brochureRoutes);
app.use("/api/project-details", projectDetailsRoutes);
app.use("/api/project-stats", projectStatsRoutes);
app.use("/api/why", whyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/floorplans", floorPlanRoutes);
app.use("/api/project-amenities", projectAmenityRoutes);
app.use("/api/specifications", specificationRoutes);
app.use("/api/construction-updates", constructionUpdateRoutes);
app.use("/api/pricelist", priceListRoutes);
app.use("/api/payment-plan", paymentPlanRoutes);
app.use("/api/smart-investment", smartInvestmentRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/project-media", projectMediaRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact-form", contactFormRoutes);

// =========================================================
// HEALTH CHECK ROUTE
// =========================================================
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend Running 🚀",
  });
});

// =========================================================
// START SERVER
// =========================================================
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("⏳ Connecting to MySQL...");
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    // Sync only in development
    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 Syncing models...");
      await sequelize.sync();
      console.log("✅ Models synced");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
})();
