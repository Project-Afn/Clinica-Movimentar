
const Patient = require('../models/patientModel');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  const { name, cpf, birthDate, phone, address } = req.body;
  
  try {
    const patientExists = await Patient.findOne({ cpf });
    
    if (patientExists) {
      return res.status(400).json({ message: 'Patient with this CPF already exists' });
    }
    
    const patient = await Patient.create({
      name,
      cpf,
      birthDate,
      phone,
      address
    });
    
    if (patient) {
      res.status(201).json(patient);
    } else {
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  const { name, cpf, birthDate, phone, address } = req.body;
  
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (patient) {
      patient.name = name || patient.name;
      patient.cpf = cpf || patient.cpf;
      patient.birthDate = birthDate || patient.birthDate;
      patient.phone = phone || patient.phone;
      patient.address = address || patient.address;
      
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (patient) {
      await patient.deleteOne();
      res.json({ message: 'Patient removed' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
};
