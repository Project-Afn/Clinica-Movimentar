
const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  birthDate: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
