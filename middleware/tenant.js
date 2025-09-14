const Note = require("../models/Note");

const enforceTenant = (req, res, next) => {
  if (!req.user?.tenant) return res.status(403).json({ message: "No tenant" });
  req.tenant = req.user.tenant;
  next();
};

module.exports = enforceTenant;
