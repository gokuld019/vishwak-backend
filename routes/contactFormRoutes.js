const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// ------------------------
// CONTACT FORM API
// ------------------------
router.post("/", async (req, res) => {
    console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);
console.log("RECEIVER_EMAIL:", process.env.RECEIVER_EMAIL);

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ------------------------
    // EMAIL TRANSPORT
    // ------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,        // Your Gmail
        pass: process.env.CONTACT_EMAIL_PASS,   // App Password
      },
    });

    // ------------------------
    // SLEEK MODERN EMAIL TEMPLATE
    // ------------------------
    const emailHTML = `
    <div style="background: #f4f7fb; padding: 40px; font-family: 'Inter', Arial, sans-serif;">
      <div style="
        max-width: 650px;
        margin: auto;
        background: #ffffff;
        border-radius: 20px;
        padding: 40px 45px;
        box-shadow: 0px 12px 35px rgba(0, 0, 0, 0.08);
        border: 1px solid #eef1f5;
      ">

        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 35px;">
          <h2 style="
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            color: #1a1a1a;
          ">
            New Contact Form Submission
          </h2>

          <p style="color: #6b7280; font-size: 15px; margin-top: 6px;">
            A visitor just submitted an enquiry from your website.
          </p>
        </div>

        <!-- INFO BOX -->
        <div style="
          background: #f9fbfc;
          padding: 25px 30px;
          border-radius: 16px;
          border: 1px solid #e5e9f2;
        ">

          <div style="margin-bottom: 22px;">
            <p style="margin: 0; font-size: 15px; color: #6b7280;">👤 Full Name</p>
            <h3 style="margin: 4px 0 0; font-size: 18px; color: #111827;">${name}</h3>
          </div>

          <hr style="border: none; border-top: 1px solid #e3e8ef; margin: 15px 0;" />

          <div style="margin-bottom: 22px;">
            <p style="margin: 0; font-size: 15px; color: #6b7280;">📧 Email Address</p>
            <h3 style="margin: 4px 0 0; font-size: 18px; color: #111827;">${email}</h3>
          </div>

          <hr style="border: none; border-top: 1px solid #e3e8ef; margin: 15px 0;" />

          <div style="margin-bottom: 22px;">
            <p style="margin: 0; font-size: 15px; color: #6b7280;">📞 Phone Number</p>
            <h3 style="margin: 4px 0 0; font-size: 18px; color: #111827;">${phone}</h3>
          </div>

          <hr style="border: none; border-top: 1px solid #e3e8ef; margin: 15px 0;" />

          <div>
            <p style="margin: 0; font-size: 15px; color: #6b7280;">💬 Message</p>
            <p style="
              margin-top: 6px;
              font-size: 17px;
              color: #111827;
              line-height: 1.6;
            ">${message}</p>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 35px;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">
            This email was sent from your website contact page.
          </p>
          <p style="color: #9ca3af; font-size: 13px;">
            © ${new Date().getFullYear()} Vishwak Properties — All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
    `;

    // ------------------------
    // MAIL OPTIONS
    // ------------------------
    const mailOptions = {
      from: `"Website Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.RECEIVER_EMAIL, // admin email
      subject: "New Contact Form Submission",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {
    console.error("Contact Form Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

module.exports = router;
