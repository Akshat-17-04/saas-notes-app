const express = require("express");
const Tenant = require("../models/Tenant");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

// Upgrade subscription (Admin only)
router.post(
  "/:slug/upgrade",
  authMiddleware,
  requireRole("ADMIN"),
  async (req, res) => {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.plan = "PRO";
    await tenant.save();
    res.json({ message: "Upgraded to PRO", tenant });
  }
);

module.exports = router;
