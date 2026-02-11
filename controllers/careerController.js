const nodemailer = require("nodemailer");
const db = require("../config/db"); // Sequelize MySQL connection
const { QueryTypes } = require("sequelize");

// ==========================
//  GET ALL JOBS
// ==========================
exports.getAllJobs = async (req, res) => {
  try {
    const rows = await db.query(
      "SELECT * FROM careers_jobs ORDER BY id DESC",
      { type: QueryTypes.SELECT }
    );

    res.json(rows);
  } catch (error) {
    console.log("Get Jobs Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  GET SINGLE JOB
// ==========================
exports.getJobById = async (req, res) => {
  try {
    const rows = await db.query(
      "SELECT * FROM careers_jobs WHERE id = ?",
      {
        replacements: [req.params.id],
        type: QueryTypes.SELECT,
      }
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Job not found" });

    res.json(rows[0]);
  } catch (error) {
    console.log("Get Job Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  CREATE JOB (ADMIN)
// ==========================
exports.createJob = async (req, res) => {
  try {
    const { title, dept, location, type, experience, salary, desc, tags, featured } =
      req.body;

    const result = await db.query(
      `INSERT INTO careers_jobs
      (title, dept, location, type, experience, salary, description, tags, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          title,
          dept,
          location,
          type,
          experience,
          salary,
          desc,
          JSON.stringify(tags || []),
          featured ? 1 : 0,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.json({ success: true, id: result[0] });
  } catch (error) {
    console.log("Create Job Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  UPDATE JOB (ADMIN)
// ==========================
exports.updateJob = async (req, res) => {
  try {
    const { title, dept, location, type, experience, salary, desc, tags, featured } =
      req.body;

    await db.query(
      `UPDATE careers_jobs SET
      title=?, dept=?, location=?, type=?, experience=?, salary=?, description=?, tags=?, featured=?
      WHERE id=?`,
      {
        replacements: [
          title,
          dept,
          location,
          type,
          experience,
          salary,
          desc,
          JSON.stringify(tags || []),
          featured ? 1 : 0,
          req.params.id,
        ],
        type: QueryTypes.UPDATE,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.log("Update Job Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  DELETE JOB (ADMIN)
// ==========================
exports.deleteJob = async (req, res) => {
  try {
    await db.query("DELETE FROM careers_jobs WHERE id = ?", {
      replacements: [req.params.id],
      type: QueryTypes.DELETE,
    });

    res.json({ success: true });
  } catch (error) {
    console.log("Delete Job Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  APPLY FOR JOB
//  – Save to DB
//  – Upload resume
//  – Send email
// ==========================
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { fullName, email, phone, currentCompany, coverLetter } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        error: "Full name, email & phone are required",
      });
    }

    let resumePath = null;
    let resumeName = null;

    if (req.file) {
      resumePath = req.file.path.replace(/\\/g, "/");
      resumeName = req.file.originalname;
    }

    // =============================
    // SAVE TO DATABASE (FIXED FOR SEQUELIZE)
    // =============================
    await db.query(
      `INSERT INTO job_applications
      (jobId, fullName, email, phone, currentCompany, coverLetter, resumePath)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          jobId,
          fullName,
          email,
          phone,
          currentCompany || "",
          coverLetter || "",
          resumePath,
        ],
        type: QueryTypes.INSERT,
      }
    );

    // =============================
    // SEND EMAIL
    // =============================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Career Application" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Job Application – ${fullName}`,
      html: `
        <h2 style="color:#16a34a;">New Career Application Received</h2>

        <p><strong>Job ID:</strong> ${jobId}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Current Company:</strong> ${currentCompany || "Not Provided"}</p>

        <h3>Cover Letter:</h3>
        <p>${coverLetter || "No cover letter provided"}</p>
      `,
      attachments: resumePath
        ? [{ filename: resumeName, path: resumePath }]
        : [],
    });

    res.json({
      success: true,
      message: "Application saved & email sent",
    });

  } catch (error) {
    console.log("Apply Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
//  GET ALL APPLICATIONS (ADMIN)
// ==========================
exports.getAllApplications = async (req, res) => {
  try {
    const rows = await db.query(
      "SELECT * FROM job_applications ORDER BY id DESC",
      { type: QueryTypes.SELECT }
    );

    res.json(rows);
  } catch (error) {
    console.log("Applications Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
