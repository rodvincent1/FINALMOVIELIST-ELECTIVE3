//server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const app = express();
const PORT = 5000;

// ====== Middleware ====== //
app.use(cors());
app.use(bodyParser.json());

// ====== MongoDB Connection ====== //
mongoose.connect("mongodb://127.0.0.1:27017/movielist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// ====== Schemas and Models ====== //

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [Object],
  ratings: {
    type: Map,
    of: Number,
  },
});

const User = mongoose.model("User", userSchema);

// Comment Schema (one comment = one document)
const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  movieId: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

// ====== Routes ====== //

// Register
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered", user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login (FIXED)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username only
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Successful login
    res.json({ message: "Login successful", user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add Favorite
app.post("/api/favorites", async (req, res) => {
  const { username, movie } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $addToSet: { favorites: movie } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove Favorite
app.delete("/api/favorites/:username/:movieId", async (req, res) => {
  const { username, movieId } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $pull: { favorites: { id: parseInt(movieId) } } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Save Rating Only
app.post("/api/rating", async (req, res) => {
  const { username, movieId, rating } = req.body;

  try {
    const update = {};
    if (rating !== undefined) update[`ratings.${movieId}`] = rating;

    const user = await User.findOneAndUpdate(
      { username },
      { $set: update },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to save rating" });
  }
});

// Create Comment
app.post("/api/comments", async (req, res) => {
  const { username, movieId, comment } = req.body;

  try {
    const newComment = new Comment({ username, movieId, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

// Get Comments by Movie
app.get("/api/comments/:movieId", async (req, res) => {
  const { movieId } = req.params;

  try {
    const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Get User
app.get("/api/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// 🚨 For development only — do not use in production without authentication!
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Only return usernames (not passwords!)
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ====== Start Server ====== //
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
