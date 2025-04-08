const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  patientName: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  therapistName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
