const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRoutes = require("./src/routes/auth");
const favoritesRoutes = require("./src/routes/favorites");
const ratingsRoutes = require("./src/routes/ratings");
const commentsRoutes = require("./src/routes/comments");
const userRoutes = require("./src/routes/user");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====== Middleware ====== //
app.use(cors());
app.use(bodyParser.json());

// ====== Database Connection ====== //
connectDB();

// ====== Routes ====== //
app.use("/api", authRoutes);
app.use("/api", favoritesRoutes);
app.use("/api", ratingsRoutes);
app.use("/api", commentsRoutes);
app.use("/api", userRoutes);

// ====== Start Server ====== //
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
