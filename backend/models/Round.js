const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  courseName: { type: String, required: true },
  scores: { type: [Number], required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema); 