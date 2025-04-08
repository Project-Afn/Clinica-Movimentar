
const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  description: {
    type: String,
    required: true
  },
  observations: {
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
