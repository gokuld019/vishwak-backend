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
// CORS CONFIG (Frontend: localhost:3000)
// =========================================================
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================================================
// STATIC FILES WITH CORS FIX FOR CINEMATIC 360°
// =========================================================
// IMPORTANT: put BEFORE routes
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow image fetch
  res.header("Cross-Origin-Resource-Policy", "cross-origin"); // required for some browsers
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================================================
// API ROUTES
// =========================================================
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/projects/menu", projectMenuRoutes); // MUST BE ABOVE
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
// HEALTH CHECK
// =========================================================
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend Running 🚀" });
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

   console.log("🔄 Checking models...");
await sequelize.sync({ alter: false });
console.log("✅ Models ready");


    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
})();
