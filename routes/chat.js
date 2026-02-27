const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
const axios = require("axios");
const AvailablePlot = require("../models/AvailablePlot");
const ProjectNearbyPlace = require("../models/ProjectNearbyPlace");
require("dotenv").config();

/* ───────── MEMORY ───────── */
let lastSelectedProject = null;

/* ───────── BUTTONS ───────── */

const MAIN_MENU_BUTTONS = [
  { label: "🏗 View Plots",      value: "show plots"      },
  { label: "🏠 View Villas",     value: "show villas"     },
  { label: "🏢 View Apartments", value: "show apartments" },
  { label: "📞 Contact Us",      value: "contact"         },
];

const PROJECT_ACTION_BUTTONS = (name) => [
  { label: "💰 Price Details",    value: `price of ${name}`           },
  { label: "📊 EMI Calculator",   value: `emi for ${name}`            },
  { label: "📋 Available Plots",  value: `available plots in ${name}` },
  { label: "🏫 Nearby Schools",   value: `nearby school in ${name}`   },
  { label: "🎓 Nearby Colleges",  value: `nearby college in ${name}`  },
  { label: "🏥 Nearby Hospitals", value: `nearby hospital in ${name}` },
  { label: "🔙 Main Menu",        value: "menu"                       },
];

/* ───────── MAIN ROUTE ───────── */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return send(res, "Please enter a message.", []);

    const query = message.toLowerCase().trim();
    const [projects] = await sequelize.query("SELECT * FROM project_details");

    /* ───────── GREETINGS ───────── */

   /* ───────── GREETINGS ───────── */

if (/^(hi|hello|hey)$/i.test(query)) {
  lastSelectedProject = null;
  return send(res, "👋 Hello! Welcome to Vishwak Properties. How can I help you today?", MAIN_MENU_BUTTONS);
}

if (/menu/i.test(query)) {
  lastSelectedProject = null;
  return send(res, "📋 Main Menu", MAIN_MENU_BUTTONS);
}

/* ───────── STRICT PLOT AVAILABILITY HANDLER ───────── */

if (
  query.startsWith("available plots") ||
  query.includes("available plots in") ||
  query.includes("plot list in") ||
  query.includes("plot availability in")
) {

  const matchedProject = findProjectByName(projects, query);

  if (matchedProject) {
    lastSelectedProject = matchedProject;
    return showAvailablePlots(res, matchedProject);
  }

  if (lastSelectedProject) {
    return showAvailablePlots(res, lastSelectedProject);
  }

  return send(
    res,
    "Please select a project first to view available plots.",
    MAIN_MENU_BUTTONS
  );
}

    /* ───────── CATEGORY BUTTONS ───────── */
    // Catch broad category queries: button clicks ("show plots") AND
    // plain typed queries ("plots", "ongoing plots", "list villas", etc.)
    // These must run BEFORE project matching so lastSelectedProject doesn't interfere.

    const isPlotQuery =
      /show plots/i.test(query) ||
      /^plots?$/i.test(query) ||
      (/plots?/i.test(query) && /ongoing|current|list|all|any|what|which|show|view|available/i.test(query));

    const isVillaQuery =
      /show villas?/i.test(query) ||
      /^villas?$/i.test(query) ||
      (/villas?/i.test(query) && /ongoing|current|list|all|any|what|which|show|view/i.test(query));

    const isApartmentQuery =
      /show apartments?/i.test(query) ||
      /^apartments?$/i.test(query) ||
      (/apartments?/i.test(query) && /ongoing|current|list|all|any|what|which|show|view/i.test(query));

    if (isPlotQuery)      { lastSelectedProject = null; return showCategory(res, projects, "plot",      "🏗 Ongoing Plot Projects"); }
    if (isVillaQuery)     { lastSelectedProject = null; return showCategory(res, projects, "villa",     "🏠 Ongoing Villa Projects"); }
    if (isApartmentQuery) { lastSelectedProject = null; return showCategory(res, projects, "apartment", "🏢 Ongoing Apartment Projects"); }

    /* ───────── PLOT AVAILABILITY — must be BEFORE isOngoingIntent ───────── */
    // Reason: "available plots in <name>" contains "available" (was in ongoingKeywords)
    // AND "plots" (in projectKeywords) — without this early check it wrongly
    // returns the full ongoing project list instead of the selected project's plots.

    const isPlotAvailabilityIntent =
      query.includes("available plots")   ||
      query.includes("plot availability") ||
      query.includes("plot list")         ||
      query.includes("plots left")        ||
      query.includes("vacant plots")      ||
      query.includes("remaining plots")   ||
      query.includes("booking status")    ||
      (
        query.includes("plot") &&
        (
          query.includes("available") ||
          query.includes("vacant")    ||
          query.includes("left")      ||
          query.includes("remaining") ||
          query.includes("stock")     ||
          query.includes("inventory") ||
          query.includes("booking")   ||
          query.includes("free")      ||
          query.includes("open")
        )
      );

    if (isPlotAvailabilityIntent) {
      const matchedPlotProject = findProjectByName(projects, query);
      if (matchedPlotProject) {
        lastSelectedProject = matchedPlotProject;
        return showAvailablePlots(res, matchedPlotProject);
      }
      if (lastSelectedProject) return showAvailablePlots(res, lastSelectedProject);
      return send(res, "Please select a project first to see available plots.", MAIN_MENU_BUTTONS);
    }

    /* ───────── SMART ONGOING PROJECT DETECTION ───────── */
    // "available" removed from ongoingKeywords — it's handled above now

    const ongoingKeywords = [
      "ongoing", "current", "active",
      "new", "latest", "running", "now"
    ];

    const projectKeywords = [
      "project", "projects", "property", "properties",
      "plots", "villas", "apartments", "homes", "flats"
    ];

    const questionKeywords = [
      "show", "list", "what", "which", "tell",
      "give", "any", "do you have", "are there"
    ];

    const isOngoingIntent =
      ongoingKeywords.some(word => query.includes(word)) &&
      projectKeywords.some(word => query.includes(word));

    const isGeneralProjectIntent =
      projectKeywords.some(word => query.includes(word)) &&
      questionKeywords.some(word => query.includes(word));

    if (isOngoingIntent || isGeneralProjectIntent) {
      const ongoing = projects.filter(
        p => String(p.status || "").trim().toLowerCase() === "ongoing"
      );

      if (!ongoing.length)
        return send(res, "No ongoing projects available at the moment.", MAIN_MENU_BUTTONS);

      let reply = `🏗 <strong>Our Ongoing Projects</strong><br><br>`;
      ongoing.forEach((p, i) => {
        reply += `${i + 1}. <strong>${p.name}</strong><br>
                  📍 ${p.location}<br>
                  🏷 ${p.category}<br><br>`;
      });

      return send(res, reply, ongoing.map(p => ({
        label: p.name,
        value: `details of ${p.name}`
      })));
    }

    /* ───────── PROJECT MATCH ───────── */

    const matched = findProjectByName(projects, query);
    if (matched) lastSelectedProject = matched;

    /* ───────── NEARBY ───────── */

    const isNearbyIntent = /nearby|distance|school|college|hospital|railway|bus|metro|it.?park/i.test(query);

    if (matched && isNearbyIntent)             return handleNearby(res, matched, query);
    if (lastSelectedProject && isNearbyIntent) return handleNearby(res, lastSelectedProject, query);

    /* ───────── PROJECT DETAIL / PRICE / EMI ───────── */

    if (matched) {
      const price = parseFloat(String(matched.pricePerSqft || 0).replace(/[^0-9.]/g, "")) || 0;

      if (/price|cost|rate/i.test(query))
        return send(res,
          `💰 <strong>${matched.name}</strong><br><br>Price per Sq.ft: ₹${price.toLocaleString()}`,
          PROJECT_ACTION_BUTTONS(matched.name)
        );

      if (/emi|loan/i.test(query))
        return send(res, emiReply(matched.name, price * 600), PROJECT_ACTION_BUTTONS(matched.name));

      return send(res,
        `🏠 <strong>${matched.name}</strong><br><br>
         📍 ${matched.location}<br>
         🏷 ${matched.category}<br>
         📊 ${matched.status}<br>
         💰 ₹${price.toLocaleString()} per sq.ft`,
        PROJECT_ACTION_BUTTONS(matched.name)
      );
    }

    if (lastSelectedProject) {
      const price = parseFloat(String(lastSelectedProject.pricePerSqft || 0).replace(/[^0-9.]/g, "")) || 0;

      if (/price|cost|rate/i.test(query))
        return send(res,
          `💰 <strong>${lastSelectedProject.name}</strong><br><br>Price per Sq.ft: ₹${price.toLocaleString()}`,
          PROJECT_ACTION_BUTTONS(lastSelectedProject.name)
        );

      if (/emi|loan/i.test(query))
        return send(res, emiReply(lastSelectedProject.name, price * 600), PROJECT_ACTION_BUTTONS(lastSelectedProject.name));
    }

    /* ───────── CONTACT ───────── */

    if (/contact|phone|email/i.test(query))
      return send(res,
        `📞 <strong>Contact Us</strong><br><br>
         Phone: +91 74011 31313<br>
         Email: sales@vishwakproperties.com`,
        MAIN_MENU_BUTTONS
      );

    /* ───────── POLITE REPLIES — handled locally, no AI needed ───────── */

    if (/^(thanks?|thank you|thx|ty|great|awesome|perfect|ok|okay|cool|got it|noted|sure|alright|welcome|nice)[\s!.]*$/i.test(query))
      return send(res,
        `😊 You're welcome! Is there anything else I can help you with?`,
        MAIN_MENU_BUTTONS
      );

    if (/bye|goodbye|see you|cya/i.test(query))
      return send(res,
        `👋 Thank you for visiting Vishwak Properties! Feel free to reach out anytime.`,
        MAIN_MENU_BUTTONS
      );

    /* ───────── AI FALLBACK ───────── */

    const aiReply = await callGemini(message);
    return send(res, aiReply, MAIN_MENU_BUTTONS);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ───────── SHOW AVAILABLE PLOTS ───────── */

async function showAvailablePlots(res, project) {
  try {
    const plots = await AvailablePlot.findAll({
      where: { projectId: project.projectId },
      order: [["slNo", "ASC"]],
    });

    if (!plots || plots.length === 0) {
      return send(
        res,
        `❌ No available plots currently in <strong>${project.name}</strong>.<br>
         Please contact us for upcoming availability.`,
        PROJECT_ACTION_BUTTONS(project.name)
      );
    }

    const totalPlots = plots.length;

    const pricePerSqft = parseFloat(
      String(project.pricePerSqft || 0).replace(/[^0-9.]/g, "")
    ) || 0;

    let reply = `
      🏡 <strong>Available Plots – ${project.name}</strong><br>
      <span style="font-size:12px;color:#6b8f5a;">
        ${totalPlots} plot${totalPlots > 1 ? "s" : ""} currently available
      </span>
      <br><br>
    `;

    reply += `
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f0f7ea;">
            <th style="padding:8px;text-align:center;border-bottom:2px solid #d6eac8;color:#2d6614;width:40px;">#</th>
            <th style="padding:8px;text-align:left;border-bottom:2px solid #d6eac8;color:#2d6614;">Plot No</th>
            <th style="padding:8px;text-align:right;border-bottom:2px solid #d6eac8;color:#2d6614;">Sq.ft</th>
            ${pricePerSqft ? `<th style="padding:8px;text-align:right;border-bottom:2px solid #d6eac8;color:#2d6614;">Price</th>` : ""}
          </tr>
        </thead>
        <tbody>
    `;

    plots.forEach((plot, index) => {
      const rowBg = index % 2 === 0 ? "#ffffff" : "#f8fdf4";
      const totalPrice = pricePerSqft ? plot.sqft * pricePerSqft : null;

      reply += `
        <tr style="background:${rowBg};">
          <td style="padding:6px 8px;text-align:center;border-bottom:1px solid #edf7e6;color:#8aa87b;font-size:11px;">
            ${plot.slNo || index + 1}
          </td>
          <td style="padding:6px 8px;border-bottom:1px solid #edf7e6;font-weight:600;color:#1e3a10;">
            Plot ${plot.plotNumber}
          </td>
          <td style="padding:6px 8px;text-align:right;border-bottom:1px solid #edf7e6;color:#3d6b21;">
            ${Number(plot.sqft).toLocaleString()} <span style="font-size:11px;color:#8aa87b;">sq.ft</span>
          </td>
          ${
            totalPrice
              ? `<td style="padding:6px 8px;text-align:right;border-bottom:1px solid #edf7e6;font-weight:600;color:#1e3a10;">
                   ₹${Math.round(totalPrice).toLocaleString()}
                 </td>`
              : ""
          }
        </tr>
      `;
    });

    reply += `
        </tbody>
      </table>
      <br>
      <span style="font-size:12px;color:#6b8f5a;">
        💡 Click on EMI Calculator for finance details.
      </span>
    `;

    return send(res, reply, PROJECT_ACTION_BUTTONS(project.name));

  } catch (error) {
    console.error("Error fetching available plots:", error);
    return send(
      res,
      "⚠️ Unable to fetch available plots at the moment. Please try again later.",
      PROJECT_ACTION_BUTTONS(project.name)
    );
  }
}

/* ───────── NEARBY HANDLER ───────── */

async function handleNearby(res, matched, query) {
  let typeFilter = null;

  if (/school/i.test(query))   typeFilter = "school";
  if (/college/i.test(query))  typeFilter = "college";
  if (/hospital/i.test(query)) typeFilter = "hospital";
  if (/railway/i.test(query))  typeFilter = "railway";
  if (/bus/i.test(query))      typeFilter = "bus";
  if (/metro/i.test(query))    typeFilter = "metro";
  if (/it.?park/i.test(query)) typeFilter = "it_park";

  const whereCondition = { projectId: matched.projectId };
  if (typeFilter) whereCondition.type = typeFilter;

  const nearby = await ProjectNearbyPlace.findAll({
    where: whereCondition,
    order: [["distance_km", "ASC"]],
  });

  const typeLabel = typeFilter
    ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).replace("_", " ") + "s"
    : "Places";

  if (!nearby.length)
    return send(res, `No nearby ${typeLabel.toLowerCase()} found for <strong>${matched.name}</strong>.`, PROJECT_ACTION_BUTTONS(matched.name));

  let reply = `📍 <strong>Nearby ${typeLabel} – ${matched.name}</strong><br><br>`;
  nearby.forEach(place => {
    reply += `• <strong>${place.name}</strong> – ${place.distance_km} km`;
    if (place.travel_time_minutes) reply += ` (${place.travel_time_minutes} mins)`;
    reply += `<br>`;
  });

  return send(res, reply, PROJECT_ACTION_BUTTONS(matched.name));
}

/* ───────── HELPERS ───────── */

function send(res, reply, buttons = []) {
  return res.json({
    choices: [{ message: { content: reply } }],
    buttons,
  });
}

// Generic words found in both project names and user queries.
// Matching on these alone causes false positives, e.g. the word "plots"
// in "Mahaa Ganapathy – Plots @ Kandigai" wrongly matching query "show plots".
const GENERIC_WORDS = new Set([
  "plots", "plot", "villa", "villas", "apartment", "apartments",
  "homes", "home", "flats", "flat", "phase", "the", "and", "for",
  "new", "at", "in", "of", "by", "a", "an"
]);

function findProjectByName(projects, search) {
  const lowerSearch = search.toLowerCase();

  // 1. Full name match (most reliable)
  const fullMatch = projects.find(p =>
    lowerSearch.includes(String(p.name).toLowerCase())
  );
  if (fullMatch) return fullMatch;

  // 2. Word-by-word — only non-generic words longer than 3 chars
  return projects.find(p => {
    const nameWords = String(p.name).toLowerCase().split(/[\s\u2013@,]+/);
    const meaningful = nameWords.filter(w => w.length > 3 && !GENERIC_WORDS.has(w));
    return meaningful.length > 0 && meaningful.some(w => lowerSearch.includes(w));
  });
}

function showCategory(res, projects, keyword, title) {
  const filtered = projects.filter(
    p =>
      String(p.category || "").toLowerCase().includes(keyword) &&
      String(p.status || "").trim().toLowerCase() === "ongoing"
  );

  if (!filtered.length)
    return send(res, `No ongoing ${keyword} projects found.`, MAIN_MENU_BUTTONS);

  let reply = `<strong>${title}</strong><br><br>`;
  filtered.forEach((p, i) => {
    reply += `${i + 1}. <strong>${p.name}</strong><br>📍 ${p.location}<br><br>`;
  });

  return send(res, reply, filtered.map(p => ({
    label: p.name,
    value: `details of ${p.name}`
  })));
}

function emiReply(name, total) {
  const loan = total * 0.8;
  const r    = 8.5 / 100 / 12;
  const n    = 20 * 12;
  const emi  = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return `📊 <strong>EMI for ${name}</strong><br><br>
          Loan Amount: ₹${Math.round(loan).toLocaleString()}<br>
          Interest: 8.5%<br>
          Tenure: 20 Years<br><br>
          💰 Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
}

async function callGemini(userMessage) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: "You are Vishwak, a professional real estate assistant for Vishwak Properties in Chennai. Answer questions about real estate, properties, plots, pricing, and location. Keep responses concise and helpful." },
            { text: userMessage }
          ]
        }]
      }
    );
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm not sure about that. You can explore our projects or contact us for more details.";
  } catch {
    // Graceful fallback — no error message shown to user
    return `I didn't quite catch that. Here's what I can help you with — feel free to explore our projects, check pricing, view available plots, or contact our team directly! 😊`;
  }
}

module.exports = router;