const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
const axios = require("axios");
const AvailablePlot = require("../models/AvailablePlot");
const ProjectNearbyPlace = require("../models/ProjectNearbyPlace");
require("dotenv").config();

/* ───────── BUTTONS ───────── */

const MAIN_MENU_BUTTONS = [
  { label: "🏗 View Plots", value: "show plots" },
  { label: "🏠 View Villas", value: "show villas" },
  { label: "🏢 View Apartments", value: "show apartments" },
  { label: "📞 Contact Us", value: "contact" },
];

const PROJECT_ACTION_BUTTONS = (name) => [
  { label: "💰 Price Details", value: `price of ${name}` },
  { label: "📊 EMI Calculator", value: `emi for ${name}` },
  { label: "📞 Contact Agent", value: "contact" },
  { label: "🔙 Main Menu", value: "menu" },
];

/* ───────── MAIN ROUTE ───────── */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return send(res, "Please enter a message.", []);

    const query = message.toLowerCase().trim();
    const [projects] = await sequelize.query("SELECT * FROM project_details");

    /* ───────── GREETING ───────── */

   /* ───────── GREETING ───────── */

if (/^(hi|hello|hey)$/i.test(query)) {
  return send(
    res,
    "👋 Hello! Welcome to Vishwak Properties. How can I help you today?",
    MAIN_MENU_BUTTONS
  );
}

if (/good morning/i.test(query)) {
  return send(
    res,
    "🌅 Good Morning! Hope you're having a wonderful day. How can I assist you with your property search?",
    MAIN_MENU_BUTTONS
  );
}

if (/good afternoon/i.test(query)) {
  return send(
    res,
    "☀️ Good Afternoon! Looking for your dream property today?",
    MAIN_MENU_BUTTONS
  );
}

if (/good evening/i.test(query)) {
  return send(
    res,
    "🌇 Good Evening! I'm here to help you explore the best properties.",
    MAIN_MENU_BUTTONS
  );
}

if (/good night/i.test(query)) {
  return send(
    res,
    "🌙 Good Night! Feel free to explore our projects anytime. I'm here to assist you.",
    MAIN_MENU_BUTTONS
  );
}

    /* ───────── AVAILABLE PLOTS COUNT ───────── */

    if (
      /(how many|total|count|number of)/i.test(query) &&
      /(plot|plots)/i.test(query)
    ) {
      const totalPlots = await AvailablePlot.count({
        where: { projectId: 1 },
      });

      return send(
        res,
        `📊 <strong>Total Available Plots:</strong> ${totalPlots}`,
        MAIN_MENU_BUTTONS
      );
    }

    /* ───────── PROJECT MATCH ───────── */

    const matched = findProjectByName(projects, query);

    if (matched) {
      const price = matched.pricePerSqft || 0;

      /* ───────── AVAILABLE PLOTS LIST ───────── */

      if (/available|vacant/i.test(query) && /plot/i.test(query)) {
        const plots = await AvailablePlot.findAll({
          where: { projectId: matched.projectId },
          order: [["plotNumber", "ASC"]],
        });

        if (!plots.length) {
          return send(
            res,
            "No available plots currently.",
            PROJECT_ACTION_BUTTONS(matched.name)
          );
        }

        let reply = `🏡 <strong>Available Plots – ${matched.name}</strong><br><br>`;

            plots.forEach(plot => {
            reply += `• Plot No: <strong>${plot.plotNumber}</strong> (${plot.sqft} sq.ft)<br>`;
        });

        if (plots.length > 20) {
          reply += `<br>Showing first 20 plots. Contact us for full list.`;
        }

        return send(res, reply, PROJECT_ACTION_BUTTONS(matched.name));
      }

      /* ───────── NEARBY PLACES ───────── */

      if (/nearby|distance|school|college|hospital|railway|bus|metro|it park/i.test(query)) {

        let typeFilter = null;

        if (/school/i.test(query)) typeFilter = "school";
        if (/college/i.test(query)) typeFilter = "college";
        if (/hospital/i.test(query)) typeFilter = "hospital";
        if (/railway/i.test(query)) typeFilter = "railway";
        if (/bus/i.test(query)) typeFilter = "bus";
        if (/metro/i.test(query)) typeFilter = "metro";
        if (/it park/i.test(query)) typeFilter = "it_park";

        let whereCondition = { projectId: matched.projectId };
        if (typeFilter) whereCondition.type = typeFilter;

        const nearby = await ProjectNearbyPlace.findAll({
          where: whereCondition,
          order: [["distance_km", "ASC"]],
        });

        if (!nearby.length) {
          return send(res, "No nearby information available.", PROJECT_ACTION_BUTTONS(matched.name));
        }

        let reply = `📍 <strong>Nearby – ${matched.name}</strong><br><br>`;

        nearby.forEach((place) => {
          reply += `• ${place.name} – ${place.distance_km} km`;
          if (place.travel_time_minutes)
            reply += ` (${place.travel_time_minutes} mins)`;
          reply += `<br>`;
        });

        return send(res, reply, PROJECT_ACTION_BUTTONS(matched.name));
      }

      /* ───────── PRICE ───────── */

      if (/price|cost|rate/i.test(query)) {
        return send(
          res,
          `💰 <strong>${matched.name}</strong><br><br>Price per Sq.ft: ₹${price}`,
          PROJECT_ACTION_BUTTONS(matched.name)
        );
      }

      /* ───────── EMI ───────── */

      if (/emi|loan/i.test(query)) {
        return send(
          res,
          emiReply(matched.name, price * 600),
          PROJECT_ACTION_BUTTONS(matched.name)
        );
      }

      /* ───────── DEFAULT PROJECT DETAILS ───────── */

      return send(
        res,
        `🏠 <strong>${matched.name}</strong><br><br>
         📍 ${matched.location}<br>
         🏷 ${matched.category}<br>
         📊 ${matched.status}<br>
         💰 ₹${price}/sq.ft`,
        PROJECT_ACTION_BUTTONS(matched.name)
      );
    }

    /* ───────── AI FALLBACK ───────── */

    const aiReply = await callGemini(message);
    return send(res, aiReply, MAIN_MENU_BUTTONS);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ───────── GEMINI FUNCTION ───────── */

async function callGemini(userMessage) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "You are Vishwak, a professional real estate assistant in Chennai." },
              { text: userMessage }
            ]
          }
        ]
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text
      || "AI returned empty response.";

  } catch (error) {
    console.log(error.response?.data || error.message);
    return "⚠️ AI service unavailable.";
  }
}

/* ───────── HELPERS ───────── */

function send(res, reply, buttons = []) {
  return res.json({
    choices: [{ message: { content: reply } }],
    buttons,
  });
}

function findProjectByName(projects, search) {
  const lowerSearch = search.toLowerCase();

  return projects.find(p => {
    const name = p.name.toLowerCase();

    // Direct full name match
    if (lowerSearch.includes(name)) return true;

    // Partial word match (aira should match Aira Avenue)
    const nameWords = name.split(" ");
    return nameWords.some(word => lowerSearch.includes(word));
  });
}

function emiReply(name, total) {
  const loan = total * 0.8;
  const r = 8.5 / 100 / 12;
  const n = 20 * 12;
  const emi =
    (loan * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  return `📊 <strong>EMI for ${name}</strong><br><br>
          Loan Amount: ₹${Math.round(loan).toLocaleString()}<br>
          Interest: 8.5%<br>
          Tenure: 20 Years<br><br>
          💰 Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
}

module.exports = router;