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

    // ===============================
    // FETCH PROJECTS FROM DATABASE
    // ===============================
    const [allProjects] = await sequelize.query(
      "SELECT * FROM project_details"
    );

    console.log(`[DB] Fetched ${allProjects.length} projects`);

    // ===============================
    // 1. COUNT QUERIES
    // ===============================
    const countMatch = userQuery.match(
      /(?:how many|count|total)\s+(?:plots?|villas?|apartments?)/i
    );

    if (!reply && countMatch) {
      const category = countMatch[0]
        .match(/(plots?|villas?|apartments?)/i)[0]
        .toLowerCase()
        .replace(/s$/, "");

      const filtered = filterByCategory(allProjects, category);

      reply = `📊 We have ${filtered.length} ${category}s available.`;
    }

    // ===============================
    // 2. EMI CALCULATION
    // ===============================
    let amountMatch;

    if (
      !reply &&
      userQuery.match(/(emi|loan|monthly)/i) &&
      (amountMatch = userQuery.match(/(\d+)\s*(?:crore|lakh)/i))
    ) {
      let amount = 0;

      if (userQuery.includes("crore")) {
        amount = parseInt(amountMatch[1]) * 10000000;
      } else {
        amount = parseInt(amountMatch[1]) * 100000;
      }

      const loanAmount = amount * 0.8;
      const downPayment = amount * 0.2;
      const interestRate = 8.5;
      const years = 20;

      const monthlyRate = interestRate / 100 / 12;
      const months = years * 12;

      const emi =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);

      reply =
        `💰 EMI CALCULATOR\n\n` +
        `Property Value: ₹${amount.toLocaleString()}\n` +
        `Down Payment: ₹${downPayment.toLocaleString()}\n` +
        `Loan Amount: ₹${loanAmount.toLocaleString()}\n\n` +
        `Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
    }

    // ===============================
    // 3. CATEGORY LIST
    // ===============================
    if (!reply) {
      const catMatch = userQuery.match(
        /\b(apartments?|villas?|plots?)\b/i
      );

      if (catMatch) {
        let category = catMatch[0].toLowerCase().replace(/s$/, "");

        const filtered = filterByCategory(allProjects, category);

        if (filtered.length > 0) {
          reply = formatCategoryProjects(filtered, category);
        }
      }
    }

    // ===============================
    // 4. OPENROUTER FALLBACK
    // ===============================
    if (!reply) {
      reply = await callOpenRouter(message, allProjects);
    }

    return res.json({
      choices: [
        {
          message: { content: reply },
        },
      ],
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// =======================================
// HELPER FUNCTIONS
// =======================================

function filterByCategory(projects, category) {
  return projects.filter((p) =>
    p.category?.toLowerCase().includes(category)
  );
}

function formatCategoryProjects(projects, category) {
  let output = `🏢 ${category.toUpperCase()} LIST\n\n`;

  projects.forEach((proj, index) => {
    output += `${index + 1}. ${proj.name} – ${proj.location}\n`;
  });

  return output;
}

async function callOpenRouter(userMessage, allProjects) {
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
            {
              role: "system",
              content:
                "You are a friendly real estate assistant.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return (
      data.choices?.[0]?.message?.content ||
      "How can I help you?"
    );
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return "Sorry, AI service is temporarily unavailable.";
  }
}

module.exports = router;