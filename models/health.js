const mongoose = require('mongoose');

// Define the health issue schema
const healthSchema = new mongoose.Schema({
  healthIssue: {
    type: String,
    required: true, // Health issue is required
  },
  symptoms: {
    type: String,
    required: true, // Symptoms are required
  },
  possibleCause: {
    type: String,
    required: false,
     // Possible cause is required after analysis
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the record is created
  },
});

// Create the Health model from the schema
const Health = mongoose.model('Health', healthSchema);

module.exports = Health;
