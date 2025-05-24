const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();

// Create Comment
router.post("/comments", async (req, res) => {
  const { username, movieId, comment } = req.body;
  try {
    const newComment = new Comment({ username, movieId, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

// Get Comments
router.get("/comments/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = router;
