const mongoose = require('mongoose');

const yogaSchema = new mongoose.Schema({
 
  recommendationDate: {
    type: Date,
    default: Date.now,
  },
  problem: {
    type: String,
    required: false,
    trim: true,
  },
  recommendedYogaPractices: [String],

  imageUrl: { type: String, required: false },
  
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const YogaRecommendation = mongoose.model('YogaRecommendation', yogaSchema);

module.exports = YogaRecommendation;
