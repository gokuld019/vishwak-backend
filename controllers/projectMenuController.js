const ProjectDetails = require("../models/ProjectDetails");

exports.getMenuProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      order: [["id", "ASC"]]
    });

    const grouped = {
      plots: [],
      villas: [],
      apartments: []
    };

    projects.forEach(p => {
      if (p.category === "plots") grouped.plots.push(p);
      if (p.category === "villas") grouped.villas.push(p);
      if (p.category === "apartments") grouped.apartments.push(p);
    });

    res.json(grouped);

  } catch (err) {
    console.error("Error grouping projects:", err);
    res.status(500).json({ error: "Server error" });
  }
};
