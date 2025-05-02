const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/movielist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [Object], // or use movie IDs instead of full objects
  ratings: {
    type: Map,
    of: Number,
  },
  comments: {
    type: Map,
    of: String,
  }
});

const User = mongoose.model("User", userSchema);

// API Endpoints

// Register User
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const user = new User({ username, password });
    await user.save();
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Save Favorites
app.post("/api/favorites", async (req, res) => {
  const { username, favorites } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { favorites },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to save favorites" });
  }
});

//Save rating and/or Comments
app.post("/api/rating", async (req, res) => {
  const { username, movieId, rating, comment } = req.body;

  try {
    const update = {};
    if (rating !== undefined) update[`ratings.${movieId}`] = rating;
    if (comment !== undefined) update[`comments.${movieId}`] = comment;

    const user = await User.findOneAndUpdate(
      { username },
      { $set: update },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to save rating/comment" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
