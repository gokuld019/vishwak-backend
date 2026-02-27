const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
const axios = require("axios");
const AvailablePlot = require("../models/AvailablePlot");
const ProjectNearbyPlace = require("../models/ProjectNearbyPlace");
require("dotenv").config();

/* ───────── MEMORY ───────── */
let lastSelectedProject = null;

/* ───────── SVG ICONS ───────── */
const ICONS = {
  building:    `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
  home:        `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  phone:       `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  currency:    `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v2m0 8v2"/></svg>`,
  calculator:  `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/></svg>`,
  list:        `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  school:      `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  graduation:  `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  hospital:    `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>`,
  arrowLeft:   `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="m15 18-6-6 6-6"/></svg>`,
  mapPin:      `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px;color:#67a139"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  tag:         `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.41z"/><path d="M7 7h.01"/></svg>`,
  activity:    `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  wave:        `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="M18.36 6.64A9 9 0 1 1 5.63 5.63"/><path d="M6.34 17.66A9 9 0 0 1 17.66 6.34"/></svg>`,
  menu:        `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e85d5d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#67a139" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  lightbulb:   `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#67a139" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.1 18 8.6 18 7a6 6 0 0 0-12 0c0 1.6.3 3.1 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>`,
  mail:        `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  xCircle:     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e85d5d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>`,
};

/* ───────── BUTTONS ───────── */

const MAIN_MENU_BUTTONS = [
  { label: "Ongoing Plots",   value: "show plots"  },
  { label: "Ongoing Villas",  value: "show villas" },
  { label: "Contact Us",      value: "contact"     },
];

const PROJECT_ACTION_BUTTONS = (name) => [
  { label: "Price Details",    value: `price of ${name}`           },
  { label: "EMI Calculator",   value: `emi for ${name}`            },
  { label: "Available Plots",  value: `available plots in ${name}` },
  { label: "Nearby Schools",   value: `nearby school in ${name}`   },
  { label: "Nearby Colleges",  value: `nearby college in ${name}`  },
  { label: "Nearby Hospitals", value: `nearby hospital in ${name}` },
  { label: "Main Menu",        value: "menu"                       },
];

/* ───────── MAIN ROUTE ───────── */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return send(res, "Please enter a message.", []);

    const query = message.toLowerCase().trim();
    const [projects] = await sequelize.query("SELECT * FROM project_details");

    /* ───────── GREETINGS ───────── */

    if (/^(hi|hello|hey)$/i.test(query)) {
      lastSelectedProject = null;
      return send(res, `${ICONS.wave}<strong>Hello!</strong> Welcome to Vishwak Properties. How can I help you today?`, MAIN_MENU_BUTTONS);
    }

    if (/menu/i.test(query)) {
      lastSelectedProject = null;
      return send(res, `${ICONS.menu}<strong>Main Menu</strong>`, MAIN_MENU_BUTTONS);
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
      if (lastSelectedProject) return showAvailablePlots(res, lastSelectedProject);
      return send(res, "Please select a project first to view available plots.", MAIN_MENU_BUTTONS);
    }

    /* ───────── CATEGORY BUTTONS ───────── */

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

    if (isPlotQuery)      { lastSelectedProject = null; return showCategory(res, projects, "plot",      "Ongoing Plot Projects"); }
    if (isVillaQuery)     { lastSelectedProject = null; return showCategory(res, projects, "villa",     "Ongoing Villa Projects"); }
    if (isApartmentQuery) { lastSelectedProject = null; return showCategory(res, projects, "apartment", "Ongoing Apartment Projects"); }

    /* ───────── PLOT AVAILABILITY ───────── */

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

    const ongoingKeywords = ["ongoing", "current", "active", "new", "latest", "running", "now"];
    const projectKeywords = ["project", "projects", "property", "properties", "plots", "villas", "apartments", "homes", "flats"];
    const questionKeywords = ["show", "list", "what", "which", "tell", "give", "any", "do you have", "are there"];

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

      let reply = `${ICONS.building}<strong>Our Ongoing Projects</strong><br><br>`;
      ongoing.forEach((p, i) => {
        reply += `${i + 1}. <strong>${p.name}</strong><br>
                  ${ICONS.mapPin}${p.location}<br>
                  ${ICONS.tag}${p.category}<br><br>`;
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
          `${ICONS.currency}<strong>${matched.name}</strong><br><br>Price per Sq.ft: ₹${price.toLocaleString()}`,
          PROJECT_ACTION_BUTTONS(matched.name)
        );

      if (/emi|loan/i.test(query))
        return send(res, emiReply(matched.name, price * 600), PROJECT_ACTION_BUTTONS(matched.name));

      return send(res,
        `${ICONS.home}<strong>${matched.name}</strong><br><br>
         ${ICONS.mapPin}${matched.location}<br>
         ${ICONS.tag}${matched.category}<br>
         ${ICONS.activity}${matched.status}<br>
         ${ICONS.currency}₹${price.toLocaleString()} per sq.ft`,
        PROJECT_ACTION_BUTTONS(matched.name)
      );
    }

    if (lastSelectedProject) {
      const price = parseFloat(String(lastSelectedProject.pricePerSqft || 0).replace(/[^0-9.]/g, "")) || 0;

      if (/price|cost|rate/i.test(query))
        return send(res,
          `${ICONS.currency}<strong>${lastSelectedProject.name}</strong><br><br>Price per Sq.ft: ₹${price.toLocaleString()}`,
          PROJECT_ACTION_BUTTONS(lastSelectedProject.name)
        );

      if (/emi|loan/i.test(query))
        return send(res, emiReply(lastSelectedProject.name, price * 600), PROJECT_ACTION_BUTTONS(lastSelectedProject.name));
    }

    /* ───────── CONTACT ───────── */

    if (/contact|phone|email/i.test(query))
      return send(res,
        `${ICONS.phone}<strong>Contact Us</strong><br><br>
         ${ICONS.phone}Phone: +91 74011 31313<br>
         ${ICONS.mail}Email: info@vishwakproperties.com`,
        MAIN_MENU_BUTTONS
      );

    /* ───────── POLITE REPLIES ───────── */

    if (/^(thanks?|thank you|thx|ty|great|awesome|perfect|ok|okay|cool|got it|noted|sure|alright|welcome|nice)[\s!.]*$/i.test(query))
      return send(res,
        `${ICONS.checkCircle}You're welcome! Is there anything else I can help you with?`,
        MAIN_MENU_BUTTONS
      );

    if (/bye|goodbye|see you|cya/i.test(query))
      return send(res,
        `${ICONS.wave}Thank you for visiting Vishwak Properties! Feel free to reach out anytime.`,
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
        `${ICONS.xCircle}No available plots currently in <strong>${project.name}</strong>.<br>
         Please contact us for upcoming availability.`,
        PROJECT_ACTION_BUTTONS(project.name)
      );
    }

    const totalPlots = plots.length;
    const pricePerSqft = parseFloat(
      String(project.pricePerSqft || 0).replace(/[^0-9.]/g, "")
    ) || 0;

    let reply = `
      ${ICONS.home}<strong>Available Plots – ${project.name}</strong><br>
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
        ${ICONS.lightbulb}Click on EMI Calculator for finance details.
      </span>
    `;

    return send(res, reply, PROJECT_ACTION_BUTTONS(project.name));

  } catch (error) {
    console.error("Error fetching available plots:", error);
    return send(
      res,
      `${ICONS.alertCircle}Unable to fetch available plots at the moment. Please try again later.`,
      PROJECT_ACTION_BUTTONS(project.name)
    );
  }
}

/* ───────── NEARBY HANDLER ───────── */

async function handleNearby(res, matched, query) {
  let typeFilter = null;
  let typeIcon = ICONS.mapPin;

  if (/school/i.test(query))   { typeFilter = "school";   typeIcon = ICONS.school;     }
  if (/college/i.test(query))  { typeFilter = "college";  typeIcon = ICONS.graduation; }
  if (/hospital/i.test(query)) { typeFilter = "hospital"; typeIcon = ICONS.hospital;   }
  if (/railway/i.test(query))  { typeFilter = "railway";  typeIcon = ICONS.mapPin;     }
  if (/bus/i.test(query))      { typeFilter = "bus";      typeIcon = ICONS.mapPin;     }
  if (/metro/i.test(query))    { typeFilter = "metro";    typeIcon = ICONS.mapPin;     }
  if (/it.?park/i.test(query)) { typeFilter = "it_park";  typeIcon = ICONS.building;   }

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
    return send(res, `${ICONS.alertCircle}No nearby ${typeLabel.toLowerCase()} found for <strong>${matched.name}</strong>.`, PROJECT_ACTION_BUTTONS(matched.name));

  let reply = `${typeIcon}<strong>Nearby ${typeLabel} – ${matched.name}</strong><br><br>`;
  nearby.forEach(place => {
    reply += `${ICONS.mapPin}<strong>${place.name}</strong> – ${place.distance_km} km`;
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

const GENERIC_WORDS = new Set([
  "plots", "plot", "villa", "villas", "apartment", "apartments",
  "homes", "home", "flats", "flat", "phase", "the", "and", "for",
  "new", "at", "in", "of", "by", "a", "an"
]);

function findProjectByName(projects, search) {
  const lowerSearch = search.toLowerCase();

  const fullMatch = projects.find(p =>
    lowerSearch.includes(String(p.name).toLowerCase())
  );
  if (fullMatch) return fullMatch;

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

  const icon = keyword === "villa" ? ICONS.home : ICONS.building;

  if (!filtered.length)
    return send(res, `${ICONS.alertCircle}No ongoing ${keyword} projects found.`, MAIN_MENU_BUTTONS);

  let reply = `${icon}<strong>${title}</strong><br><br>`;
  filtered.forEach((p, i) => {
    reply += `${i + 1}. <strong>${p.name}</strong><br>${ICONS.mapPin}${p.location}<br><br>`;
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

  return `${ICONS.calculator}<strong>EMI for ${name}</strong><br><br>
          Loan Amount: ₹${Math.round(loan).toLocaleString()}<br>
          Interest: 8.5%<br>
          Tenure: 20 Years<br><br>
          ${ICONS.currency}Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
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
    return `I didn't quite catch that. Here's what I can help you with — feel free to explore our projects, check pricing, view available plots, or contact our team directly!`;
  }
}

module.exports = router;