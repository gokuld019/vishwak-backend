const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
require("dotenv").config();

/*
  POST /api/chat
*/
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const userQuery = message.toLowerCase().trim();
    let reply = "";

    // Fetch all projects
    const [allProjects] = await sequelize.query(
      "SELECT * FROM project_details"
    );

    // ================= GREETING =================
    if (/^(hi|hello|hey|good morning|good evening)/i.test(userQuery)) {
      reply =
        "👋 Hello! Welcome to Vishwak Properties.\n\nYou can ask about plots, villas, apartments, price, EMI, budget, RERA, amenities, or schedule a site visit.";
    }

    // ================= COUNT =================
    const countMatch = userQuery.match(
      /(?:how many|count|total)\s+(plots?|villas?|apartments?)/i
    );

    if (!reply && countMatch) {
      const category = countMatch[1].replace(/s$/, "");
      const filtered = filterByCategory(allProjects, category);
      reply = `📊 We currently have ${filtered.length} ${category}s available.`;
    }

    // ================= LOCATION FILTER =================
    if (!reply && /projects in|in\s+[a-z]/i.test(userQuery)) {
      const match = userQuery.match(/in\s+([a-zA-Z ]+)/i);
      if (match) {
        const location = match[1].trim();
        const filtered = allProjects.filter(p =>
          p.location?.toLowerCase().includes(location)
        );

        if (filtered.length > 0) {
          reply = `📍 Projects in ${location}:\n\n`;
          filtered.forEach((p, i) => {
            reply += `${i + 1}. ${p.name}\n`;
          });
        }
      }
    }

    // ================= CATEGORY LIST =================
    if (!reply) {
      const catMatch = userQuery.match(/\b(apartments?|villas?|plots?)\b/i);
      if (catMatch) {
        const category = catMatch[0].replace(/s$/, "");
        const filtered = filterByCategory(allProjects, category);
        if (filtered.length > 0) {
          reply = formatCategoryProjects(filtered, category);
        }
      }
    }

    // ================= SMART PROJECT MATCH =================
    if (!reply) {
      const matched = findProjectByName(allProjects, userQuery);

      if (matched) {
        const price = parseFloat(matched.pricePerSqft || 0);
        const defaultSqft = 600;
        const total = price * defaultSqft;

        // PRICE
        if (/price|cost|rate|amount/i.test(userQuery)) {
          reply =
            `💰 ${matched.name} Pricing\n\n` +
            `Price per Sq.ft: ₹${price}\n` +
            `Estimated ${defaultSqft} sqft Cost: ₹${total.toLocaleString()}`;
        }

        // SQFT CUSTOM
        else if (/(\d+)\s*(sq\.?ft|square)/i.test(userQuery)) {
          const sqft = parseInt(
            userQuery.match(/(\d+)\s*(sq\.?ft|square)/i)[1]
          );
          const totalCost = price * sqft;

          reply =
            `🏠 ${matched.name}\n\n` +
            `Price per Sq.ft: ₹${price}\n` +
            `For ${sqft} sqft:\n` +
            `💰 Total Cost: ₹${totalCost.toLocaleString()}`;
        }

        // EMI
        else if (/emi|loan|monthly/i.test(userQuery)) {
          const loanAmount = total * 0.8;
          const downPayment = total * 0.2;
          const interestRate = 8.5;
          const years = 20;

          const monthlyRate = interestRate / 100 / 12;
          const months = years * 12;

          const emi =
            (loanAmount *
              (monthlyRate * Math.pow(1 + monthlyRate, months))) /
            (Math.pow(1 + monthlyRate, months) - 1);

          reply =
            `🏠 ${matched.name}\n\n` +
            `Property Cost: ₹${total.toLocaleString()}\n` +
            `Down Payment: ₹${downPayment.toLocaleString()}\n` +
            `📊 Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
        }

        // RERA
        else if (/rera/i.test(userQuery)) {
          reply = `📜 RERA Number: ${matched.reraNumber || "Not Available"}`;
        }

        // COMPLETION
        else if (/completion|progress/i.test(userQuery)) {
          reply =
            `🏗 Completion Status: ${
              matched.completionPercentage || "N/A"
            }%`;
        }

        // AMENITIES
        else if (/amenities|features|facilities/i.test(userQuery)) {
          reply =
            `✨ Amenities at ${matched.name}:\n\n` +
            (matched.topDescription || "Details available on request.");
        }

        // GENERAL DETAILS
        else {
          reply = formatProjectDetails(matched);
        }
      }
    }

    // ================= BUDGET FILTER =================
    if (!reply && /under\s+\d+/i.test(userQuery)) {
      const match = userQuery.match(/under\s+(\d+)\s*(lakh|crore)?/i);
      if (match) {
        const amount =
          match[2] === "crore"
            ? parseInt(match[1]) * 10000000
            : parseInt(match[1]) * 100000;

        const filtered = allProjects.filter(
          p => parseFloat(p.pricePerSqft || 0) * 600 <= amount
        );

        if (filtered.length > 0) {
          reply = `💰 Projects under ₹${amount.toLocaleString()}:\n\n`;
          filtered.forEach((p, i) => {
            reply += `${i + 1}. ${p.name}\n`;
          });
        }
      }
    }

    // ================= COMPARE =================
    if (!reply && /compare/i.test(userQuery)) {
      const found = allProjects.filter(p =>
        userQuery.includes(p.name.toLowerCase())
      );

      if (found.length === 2) {
        reply =
          `📊 Comparison\n\n` +
          `${found[0].name} – ₹${found[0].pricePerSqft}/sq.ft\n` +
          `${found[1].name} – ₹${found[1].pricePerSqft}/sq.ft`;
      }
    }

    // ================= BANK =================
    if (!reply && /bank|loan approval|finance/i.test(userQuery)) {
      reply =
        "🏦 We have tie-ups with leading banks for easy loan approval.\nWould you like assistance?";
    }

    // ================= SITE VISIT =================
    if (!reply && /site visit|visit|schedule/i.test(userQuery)) {
      reply =
        "📅 We'd love to arrange a site visit.\nPlease share your contact number so our team can assist you.";
    }

    // ================= THANK YOU =================
    if (!reply && /(thanks|thank you|thx)/i.test(userQuery)) {
      reply = "😊 You're welcome! Let me know if you need anything else.";
    }

    // ================= AI FALLBACK =================
    if (!reply) {
      reply = await callOpenRouter(message);
    }

    return res.json({
      choices: [{ message: { content: reply } }],
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= HELPERS =================

function filterByCategory(projects, category) {
  return projects.filter(p =>
    p.category?.toLowerCase().includes(category)
  );
}

function formatCategoryProjects(projects, category) {
  let output = `🏢 ${category.toUpperCase()} LIST\n\n`;
  projects.forEach((p, i) => {
    output += `${i + 1}. ${p.name} – ${p.location}\n`;
  });
  return output;
}

function findProjectByName(projects, searchTerm) {
  searchTerm = searchTerm
    .replace(/price|cost|emi|loan|monthly|rate|amount|details|about|of|what|is/gi, "")
    .trim();

  let bestMatch = null;
  let highestScore = 0;

  for (const project of projects) {
    const name = project.name.toLowerCase();
    let score = 0;

    if (name.includes(searchTerm)) score += 50;

    searchTerm.split(" ").forEach(sw => {
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
  return (
    `🏠 ${project.name}\n\n` +
    `📍 Location: ${project.location}\n` +
    `🏷 Type: ${project.category}\n` +
    `📊 Status: ${project.status}\n` +
    `💰 Price: ₹${project.pricePerSqft}/sq.ft`
  );
}

async function callOpenRouter(userMessage) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return "AI service not configured.";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            { role: "system", content: "You are a friendly real estate assistant." },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "How can I help?";
  } catch {
    return "AI service temporarily unavailable.";
  }
}

module.exports = router;