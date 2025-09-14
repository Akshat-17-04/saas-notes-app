require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Tenant = require("../models/Tenant");

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesApp"
    );

    console.log("Connected to MongoDB");

    // Clear old data
    await User.deleteMany();
    await Tenant.deleteMany();

    // Create tenants
    const acme = await Tenant.create({
      name: "Acme",
      slug: "acme",
      plan: "FREE", // start with Free plan
    });

    const globex = await Tenant.create({
      name: "Globex",
      slug: "globex",
      plan: "FREE",
    });

    // Helper to create users
    const createUser = async (email, role, tenant) => {
      const hashedPassword = await bcrypt.hash("password", 10);
      return User.create({
        email,
        password: hashedPassword,
        role,
        tenant: tenant._id,
      });
    };

    // Seed users
    await createUser("admin@acme.test", "ADMIN", acme);
    await createUser("user@acme.test", "MEMBER", acme);
    await createUser("admin@globex.test", "ADMIN", globex);
    await createUser("user@globex.test", "MEMBER", globex);

    console.log("Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error(" Seeding error:", err.message);
    process.exit(1);
  }
};

seed();
