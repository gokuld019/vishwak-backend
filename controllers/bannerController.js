const Banner = require("../models/Banner");
const fs = require("fs");


// GET ALL
exports.getBanners = async (req, res) => {
  try {
    const { deviceType } = req.query;

    const where = {
      isActive: true,
    };

    if (deviceType) {
      where.deviceType = deviceType;
    }

    const banners = await Banner.findAll({
      where,
      order: [["sortOrder", "ASC"]],
    });

    res.json(banners);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// CREATE
exports.createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      deviceType,
      sortOrder,
      isActive,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Banner image required",
      });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      deviceType,
      sortOrder,
      isActive,
      image: "/uploads/banners/" + req.file.filename,
    });

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// DELETE
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    if (banner.image && fs.existsSync("." + banner.image)) {
      fs.unlinkSync("." + banner.image);
    }

    await banner.destroy();

    res.json({
      message: "Banner deleted successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};