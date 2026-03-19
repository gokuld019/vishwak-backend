const axios = require("axios");

const sendLeadToCRM = async ({ name, email, phone, message }) => {
  try {

    const url = `https://app.sell.do/api/leads/create`;

    const params = {
      api_key: process.env.SELLDO_API_KEY,

      "sell_do[form][lead][name]": name,
      "sell_do[form][lead][email]": email || "",
      "sell_do[form][lead][phone]": phone,

      "sell_do[campaign][srd]": process.env.SELLDO_SRD,

      "sell_do[form][note][content]": message || "Website Enquiry",
    };

    const response = await axios.get(url, { params });

    console.log("✅ CRM RESPONSE SUCCESS:", response.data);

  } catch (err) {
    console.log(
      "❌ CRM RESPONSE ERROR:",
      err.response?.data || err.message
    );
  }
};

module.exports = sendLeadToCRM;