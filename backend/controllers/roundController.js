const Round = require('../models/Round');

// Create a new round
exports.createRound = async (req, res) => {
  try {
    const { date, courseName, scores, location } = req.body;
    const userId = req.user.id; // This will come from JWT middleware

    if (!date || !courseName || !scores || scores.length !== 18) {
      return res.status(400).json({ 
        message: 'Date, course name, and 18 hole scores are required.' 
      });
    }

    const round = await Round.create({
      user: userId,
      date,
      courseName,
      scores,
      location: location || {}
    });

    res.status(201).json(round);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user's round history
exports.getUserRounds = async (req, res) => {
  try {
    const userId = req.user.id;
    const rounds = await Round.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(50); // Limit to last 50 rounds

    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a round
exports.deleteRound = async (req, res) => {
  try {
    const { roundId } = req.params;
    const userId = req.user.id;

    const round = await Round.findOne({ _id: roundId, user: userId });
    
    if (!round) {
      return res.status(404).json({ message: 'Round not found or you do not have permission to delete it.' });
    }

    await Round.findByIdAndDelete(roundId);
    res.json({ message: 'Round deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 