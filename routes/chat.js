const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
require("dotenv").config();

/* ───────────────────────────────────────────
   BUTTON DEFINITIONS
─────────────────────────────────────────── */
const MAIN_MENU_BUTTONS = [
  { label: "🏗 View Plots",      value: "show plots"      },
  { label: "🏠 View Villas",     value: "show villas"     },
  { label: "🏢 View Apartments", value: "show apartments" },
  { label: "📞 Contact Us",      value: "contact"         },
];

const PROJECT_ACTION_BUTTONS = (projectName) => [
  { label: "💰 Price Details",  value: `price of ${projectName}` },
  { label: "📊 EMI Calculator", value: `emi for ${projectName}`  },
  { label: "📞 Contact Agent",  value: "contact"                 },
  { label: "🔙 Main Menu",      value: "menu"                    },
];

const AFTER_CONTACT_BUTTONS = [
  { label: "🔙 Main Menu", value: "menu" },
];

/* ───────────────────────────────────────────
   POST /api/chat
─────────────────────────────────────────── */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const userQuery = message.toLowerCase().trim();
    let reply   = "";
    let buttons = [];

    const [allProjects] = await sequelize.query("SELECT * FROM project_details");

    /* ── MAIN MENU trigger ── */
    if (/^(menu|main menu|start|restart|back)$/i.test(userQuery)) {
      reply   = "🏠 Welcome back! What would you like to explore?";
      buttons = MAIN_MENU_BUTTONS;
      return sendResponse(res, reply, buttons);
    }

    /* ── GOOD MORNING ── */
    if (/good\s*morning/i.test(userQuery)) {
      reply = `🌅 <strong>Good Morning!</strong> Hope you're having a wonderful start to your day! ☀️<br><br>
               I'm <strong>Vishwak</strong>, your Property Assistant at <strong>Vishwak Properties</strong>.<br><br>
               Ready to help you find your dream property today! How can I assist you? 😊`;
      buttons = MAIN_MENU_BUTTONS;
      return sendResponse(res, reply, buttons);
    }

    /* ── GOOD AFTERNOON ── */
    if (/good\s*afternoon/i.test(userQuery)) {
      reply = `☀️ <strong>Good Afternoon!</strong> Hope you're having a productive and pleasant day! 😊<br><br>
               I'm <strong>Vishwak</strong>, your Property Assistant at <strong>Vishwak Properties</strong>.<br><br>
               Let's make your afternoon even better — shall we find your perfect property? 🏡`;
      buttons = MAIN_MENU_BUTTONS;
      return sendResponse(res, reply, buttons);
    }

    /* ── GOOD EVENING ── */
    if (/good\s*evening/i.test(userQuery)) {
      reply = `🌇 <strong>Good Evening!</strong> Hope you had a great day! 😊<br><br>
               I'm <strong>Vishwak</strong>, your Property Assistant at <strong>Vishwak Properties</strong>.<br><br>
               A perfect time to explore your dream home. How can I help you this evening? 🏡`;
      buttons = MAIN_MENU_BUTTONS;
      return sendResponse(res, reply, buttons);
    }

    /* ── GOOD NIGHT ── */
    if (/good\s*night/i.test(userQuery)) {
      reply = `🌙 <strong>Good Night!</strong> Thank you for visiting <strong>Vishwak Properties</strong>. 😊<br><br>
               Sweet dreams! 🌟 We'll be right here whenever you're ready to find your dream property. 🏡`;
      buttons = [];
      return sendResponse(res, reply, buttons);
    }

    /* ── GENERIC GREETING (hi / hello / hey) ── */
    /* ── GENERIC GREETING (hi / hello / hey) ── */
if (/^(hi|hello|hey)\b/i.test(userQuery)) {
  const hour = new Date().getHours();

  let timeEmoji, timeGreet, timeNote;
  if (hour >= 5 && hour < 12) {
    timeEmoji = "🌅"; timeGreet = "Good Morning";
    timeNote  = "How are you doing? Hope your morning is going great! ☀️";
  } else if (hour >= 12 && hour < 17) {
    timeEmoji = "☀️"; timeGreet = "Good Afternoon";
    timeNote  = "How are you? Hope you're having a wonderful afternoon! 😊";
  } else if (hour >= 17 && hour < 21) {
    timeEmoji = "🌇"; timeGreet = "Good Evening";
    timeNote  = "How's your day been? Hope it was amazing! 🌟";
  } else {
    timeEmoji = "👋"; timeGreet = "Hey";
    timeNote  = "How are you doing tonight? Hope you're having a good one! 😊";
  }

  reply = `${timeEmoji} <strong>${timeGreet}!</strong> Hi there, welcome to <strong>Vishwak Properties</strong>! 😊<br><br>
           ${timeNote}<br><br>
           I'm <strong>Vishwak</strong>, your personal property assistant — here to help you find your perfect home! 🏡<br><br>
           What can I do for you today?`;
  buttons = MAIN_MENU_BUTTONS;
  return sendResponse(res, reply, buttons);
}

    /* ── SHOW CATEGORY (button click: "show plots" etc.) ── */
    const showMatch = userQuery.match(/^show\s+(plots?|villas?|apartments?)/i);
    if (showMatch) {
      const cat      = showMatch[1].toLowerCase().replace(/s$/, "");
      const filtered = filterByCategory(allProjects, cat, "ongoing");

      if (filtered.length === 0) {
        reply   = `😔 No ongoing ${cat}s available right now. Check back soon!`;
        buttons = MAIN_MENU_BUTTONS;
      } else {
        reply  = `🏢 <strong>Ongoing ${cap(cat)}s</strong><br><br>`;
        reply += filtered.map((p, i) =>
          `${i + 1}. <strong>${p.name}</strong><br>📍 ${p.location}`
        ).join("<br><br>");
        reply += "<br><br>Tap a project name or choose an action:";
        buttons = [
          ...filtered.slice(0, 3).map(p => ({ label: p.name, value: `details of ${p.name}` })),
          { label: "🔙 Main Menu", value: "menu" },
        ];
      }
      return sendResponse(res, reply, buttons);
    }

    /* ── COUNT QUERY ── */
    const countMatch = userQuery.match(
      /(?:how many|count|total)\s+(plots?|villas?|apartments?)/i
    );
    if (!reply && countMatch) {
      const cat      = countMatch[1].toLowerCase().replace(/s$/, "");
      const filtered = filterByCategory(allProjects, cat, "ongoing");
      reply   = `📊 We currently have <strong>${filtered.length}</strong> ongoing ${cat}s available.`;
      buttons = MAIN_MENU_BUTTONS;
    }

    /* ── STATUS + CATEGORY ── */
    const statusMatch = userQuery.match(
      /(ongoing|completed|sold out|sold_out)\s+(plots?|villas?|apartments?)/i
    );
    if (!reply && statusMatch) {
      let status = statusMatch[1].toLowerCase();
      const cat  = statusMatch[2].toLowerCase().replace(/s$/, "");
      if (status === "sold out") status = "sold_out";
      const filtered = filterByCategory(allProjects, cat, status);
      if (filtered.length === 0) {
        reply = `No ${status} ${cat}s available.`;
      } else {
        reply  = `<strong>${status.toUpperCase()} ${cap(cat)}s</strong><br><br>`;
        reply += filtered.map((p, i) =>
          `${i + 1}. <strong>${p.name}</strong><br>📍 ${p.location}`
        ).join("<br><br>");
      }
      buttons = MAIN_MENU_BUTTONS;
    }

    /* ── CATEGORY LIST (typed naturally) ── */
    if (!reply) {
      const catMatch = userQuery.match(/\b(apartments?|villas?|plots?)\b/i);
      if (catMatch) {
        const cat      = catMatch[0].toLowerCase().replace(/s$/, "");
        const filtered = filterByCategory(allProjects, cat, "ongoing");
        if (filtered.length > 0) {
          reply  = `🏢 <strong>Ongoing ${cap(cat)}s</strong><br><br>`;
          reply += filtered.map((p, i) =>
            `${i + 1}. <strong>${p.name}</strong><br>📍 ${p.location}`
          ).join("<br><br>");
          buttons = [
            ...filtered.slice(0, 3).map(p => ({ label: p.name, value: `details of ${p.name}` })),
            { label: "🔙 Main Menu", value: "menu" },
          ];
        }
      }
    }

    /* ── SMART PROJECT MATCH ── */
    if (!reply) {
      const matched = findProjectByName(allProjects, userQuery);
      if (matched) {
        const pricePerSqft   = parseFloat(matched.pricePerSqft || 0);
        const estimatedTotal = pricePerSqft * 600;

        if (/price|cost|rate|amount/i.test(userQuery)) {
          reply = `💰 <strong>${matched.name} – Pricing</strong><br><br>
                   Price per Sq.ft: <strong>₹${pricePerSqft}</strong><br>
                   Status: ${matched.status}<br><br>
                   Would you like an EMI calculation?`;
          buttons = PROJECT_ACTION_BUTTONS(matched.name);
        } else if (/emi|loan|monthly/i.test(userQuery)) {
          reply   = emiReply(matched.name, estimatedTotal);
          buttons = PROJECT_ACTION_BUTTONS(matched.name);
        } else {
          reply   = formatProjectDetails(matched);
          buttons = PROJECT_ACTION_BUTTONS(matched.name);
        }
      }
    }

    /* ── GENERAL EMI ── */
    let amountMatch;
    if (
      !reply &&
      userQuery.match(/(emi|loan|monthly)/i) &&
      (amountMatch = userQuery.match(/(\d+)\s*(crore|lakh)/i))
    ) {
      const amount = amountMatch[2] === "crore"
        ? parseInt(amountMatch[1]) * 10_000_000
        : parseInt(amountMatch[1]) * 100_000;
      reply   = emiReply("Your Property", amount);
      buttons = MAIN_MENU_BUTTONS;
    }

    /* ── CONTACT ── */
    if (!reply && /(contact|phone|email|call|agent)/i.test(userQuery)) {
      reply = `📞 <strong>Contact Vishwak Properties</strong><br><br>
               📱 Phone: <strong>+91 98765 43210</strong><br>
               📧 Email: <strong>sales@vishwakproperties.com</strong><br><br>
               Our team will get back to you shortly! 🙏`;
      buttons = AFTER_CONTACT_BUTTONS;
    }

    /* ── FALLBACK ── */
    /* ── FALLBACK ── */
if (!reply) {
  const friendlyFallbacks = [
    "😊 I'm not sure I understood that fully, but I'm here to help! Feel free to explore the options below or ask me anything about our properties. 🏡",
    "🙂 Hmm, I didn't quite get that — no worries though! You can pick an option below or ask me about plots, villas, apartments, pricing, or EMI. I'm happy to help!",
    "💬 Thanks for reaching out! I may have missed that one. Try choosing from the options below — I'm always here for you! 😊",
  ];
  reply   = friendlyFallbacks[Math.floor(Math.random() * friendlyFallbacks.length)];
  buttons = MAIN_MENU_BUTTONS;
}

    return sendResponse(res, reply, buttons);

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ───────────────────────────────────────────
   HELPERS
─────────────────────────────────────────── */
function sendResponse(res, reply, buttons = []) {
  return res.json({
    choices: [{ message: { content: reply } }],
    buttons,
  });
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function emiReply(name, totalAmount) {
  const loanAmount   = totalAmount * 0.8;
  const interestRate = 8.5;
  const years        = 20;
  const monthlyRate  = interestRate / 100 / 12;
  const months       = years * 12;
  const emi =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return `📊 <strong>EMI Calculation – ${name}</strong><br><br>
          Loan Amount (80%): <strong>₹${Math.round(loanAmount).toLocaleString()}</strong><br>
          Interest Rate: <strong>8.5% p.a.</strong><br>
          Tenure: <strong>20 years</strong><br><br>
          💰 Monthly EMI: <strong>₹${Math.round(emi).toLocaleString()}</strong>`;
}

function filterByCategory(projects, category, status = "ongoing") {
  return projects.filter(
    (p) =>
      p.category?.toLowerCase().includes(category) &&
      p.status?.toLowerCase() === status
  );
}

function findProjectByName(projects, searchTerm) {
  searchTerm = searchTerm
    .replace(/price|cost|emi|loan|monthly|rate|amount|details|about|of|what|is|show/gi, "")
    .trim();
  let bestMatch = null;
  let highestScore = 0;
  for (const project of projects) {
    const name = project.name.toLowerCase();
    let score = 0;
    if (name.includes(searchTerm)) score += 50;
    searchTerm.split(" ").forEach((sw) => {
      if (name.includes(sw) && sw.length > 2) score += 10;
    });
    if (score > highestScore) {
      highestScore = score;
      bestMatch = project;
    }
  }
  return highestScore > 10 ? bestMatch : null;
}

function formatProjectDetails(project) {
  return `🏠 <strong>${project.name}</strong><br><br>
          📍 Location: ${project.location}<br>
          🏷 Type: ${project.category}<br>
          📊 Status: ${project.status}<br>
          💰 Price: <strong>₹${project.pricePerSqft}/sq.ft</strong>`;
}

module.exports = router;