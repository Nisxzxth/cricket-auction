const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  proficiency: {
    type: String,
    required: true,
    enum: ['Batter', 'Bowler', 'All Rounder', 'Wicket-keeper']
  },
  image: {
    type: String,
    default: '/players/default.png'
  },
  status: {
    type: String,
    enum: ['Unsold', 'Sold'],
    default: 'Unsold'
  },
  soldPrice: {
    type: Number,
    default: null
  },
  team: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
