const axios = require("axios");

const sendWhatsAppLead = async ({ name, phone, message }) => {
  try {
    const payload = {
      integrated_number: "918124442000",
      content_type: "template",
      payload: {
        messaging_product: "whatsapp",
        type: "template",
        template: {
          name: "new_lead",
          language: {
            code: "en_US",
            policy: "deterministic",
          },
          namespace: "ec0b0176_ff4e_4ad1_a761_35494dc83649",
          to_and_components: [
            {
              to: ["918667642578"], // ADMIN NUMBER
              components: {
                body_name: {
                  type: "text",
                  value: name,
                  parameter_name: "name",
                },
                body_phone: {
                  type: "text",
                  value: phone,
                  parameter_name: "phone",
                },
                body_message: {
                  type: "text",
                  value: message || "Website Enquiry",
                  parameter_name: "message",
                },
              },
            },
          ],
        },
      },
    };

    await axios.post(
      "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      payload,
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp Sent");
  } catch (err) {
    console.log("❌ WhatsApp Error:", err.response?.data || err.message);
  }
};

module.exports = sendWhatsAppLead;