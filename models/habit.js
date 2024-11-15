const mongoose = require('mongoose');

// Check if the model already exists in mongoose.models to avoid overwriting it
const habitSchema = new mongoose.Schema({
  habitName: String,
  goal: Number,
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// Prevent overwriting the model if it's already defined
const Habit =  mongoose.model('Habit', habitSchema);

module.exports = Habit;
