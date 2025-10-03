import User from "../models/userSchema.js";

export const totalsReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const serviceProviders = await User.countDocuments({ role: "Service Provider" });
    const totalPopulation = 200; // example static

    res.json({ totalUsers, serviceProviders, totalPopulation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const demographicsReport = async (req, res) => {
  try {
    const users = await User.find();

    const ageGroups = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };
    let worker = 0;
    let nonWorker = 0;

    users.forEach(user => {
      const age = Math.floor((Date.now() - new Date(user.birthdate)) / (1000 * 60 * 60 * 24 * 365.25));
      if (age <= 25) ageGroups["18-25"]++;
      else if (age <= 35) ageGroups["26-35"]++;
      else if (age <= 50) ageGroups["36-50"]++;
      else ageGroups["50+"]++;

      if (user.employed === "Yes") worker++;
      else nonWorker++;
    });

    res.json({ ageGroups, employment: { worker, nonWorker } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const skillsReport = async (req, res) => {
  try {
    const users = await User.find();
    const skillsCount = {};

    users.forEach(user => {
      (user.skills || []).forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    res.json(skillsCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
