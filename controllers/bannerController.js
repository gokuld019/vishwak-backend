// controllers/bannerController.js
const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

/**
 * -----------------------------------------------------
 * GET ALL BANNERS (Public - Homepage)
 * -----------------------------------------------------
 */
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [["id", "ASC"]],
    });
    return res.json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * -----------------------------------------------------
 * GET SINGLE BANNER BY ID
 * -----------------------------------------------------
 */
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    return res.json(banner);
  } catch (err) {
    console.error("Error fetching banner:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * -----------------------------------------------------
 * UPLOAD / REPLACE MULTIPLE BANNERS (1–3 FILES)
 * -----------------------------------------------------
 * Admin uploads 1–3 banner files.
 * Previous banners are deleted & replaced.
 * -----------------------------------------------------
 */
exports.uploadBanners = async (req, res) => {
  try {
    const files = req.files; // multer → upload.array("banners", 3)
    const { title, subtitle } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload at least 1 banner image" });
    }

    // Get old banners
    const oldBanners = await Banner.findAll();

    // Delete old banner images from disk
    oldBanners.forEach((b) => {
      if (b.image && fs.existsSync("." + b.image)) {
        fs.unlinkSync("." + b.image);
      }
    });

    // Delete old banners from DB
    await Banner.destroy({ where: {} });

    // Prepare new banners
    const newBanners = files.map((file) => ({
      title: title || null,
      subtitle: subtitle || null,
      highlight: null,
      image: "/uploads/banners/" + file.filename,
    }));

    // Insert into DB
    const created = await Banner.bulkCreate(newBanners);

    return res.status(201).json({
      message: "Banners uploaded successfully",
      banners: created,
    });
  } catch (err) {
    console.error("Error uploading banners:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * -----------------------------------------------------
 * UPDATE SINGLE BANNER (Text Only)
 * -----------------------------------------------------
 */
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, highlight } = req.body;

    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.update({
      title: title ?? banner.title,
      subtitle: subtitle ?? banner.subtitle,
      highlight: highlight ?? banner.highlight,
    });

    return res.json({ message: "Banner updated successfully", data: banner });
  } catch (err) {
    console.error("Error updating banner:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * -----------------------------------------------------
 * DELETE SINGLE BANNER
 * -----------------------------------------------------
 */
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete image
    if (banner.image && fs.existsSync("." + banner.image)) {
      fs.unlinkSync("." + banner.image);
    }

    await banner.destroy();

    return res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
