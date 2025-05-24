const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Add Favorite
router.post("/favorites", async (req, res) => {
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
router.delete("/favorites/:username/:movieId", async (req, res) => {
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

module.exports = router;
