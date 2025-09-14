const express = require("express");
const Note = require("../models/Note");
const { authMiddleware } = require("../middleware/auth");
const enforceTenant = require("../middleware/tenant");

const router = express.Router();

// Create note (respect plan limits)
router.post("/", authMiddleware, enforceTenant, async (req, res) => {
  const { content } = req.body;
  const noteCount = await Note.countDocuments({ tenant: req.tenant._id });

  if (req.tenant.plan === "FREE" && noteCount >= 3) {
    return res.status(403).json({ message: "Free plan limit reached" });
  }

  const note = await Note.create({
    content,
    tenant: req.tenant._id,
    createdBy: req.user._id,
  });
  res.json(note);
});

// List notes
router.get("/", authMiddleware, enforceTenant, async (req, res) => {
  const notes = await Note.find({ tenant: req.tenant._id });
  res.json(notes);
});

// CRUD by ID
router.get("/:id", authMiddleware, enforceTenant, async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    tenant: req.tenant._id,
  });
  if (!note) return res.status(404).json({ message: "Not found" });
  res.json(note);
});

router.put("/:id", authMiddleware, enforceTenant, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenant: req.tenant._id },
    { content: req.body.content },
    { new: true }
  );
  res.json(note);
});

router.delete("/:id", authMiddleware, enforceTenant, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, tenant: req.tenant._id });
  res.json({ message: "Deleted" });
});

module.exports = router;
