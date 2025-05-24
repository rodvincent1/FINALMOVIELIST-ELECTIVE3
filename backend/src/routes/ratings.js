const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Save Rating
router.post("/rating", async (req, res) => {
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

module.exports = router;
