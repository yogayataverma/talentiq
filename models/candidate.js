const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, required: true, default: 'new' },
  experience: { type: String, required: true },
  resume: { type: String, required: true },
});

module.exports = mongoose.model('Candidate', candidateSchema); 