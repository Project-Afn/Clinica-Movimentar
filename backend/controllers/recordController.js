
const Record = require('../models/recordModel');
const User = require('../models/userModel');

// @desc    Get all records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const records = await Record.find({}).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get records by patient ID
// @route   GET /api/records/patient/:patientId
// @access  Private
const getRecordsByPatient = async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Private
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  const { patientId, description, observations, therapistId } = req.body;
  
  try {
    // Get therapist name
    const therapist = await User.findById(therapistId);
    
    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }
    
    const record = await Record.create({
      patientId,
      description,
      observations,
      therapistId,
      therapistName: therapist.name
    });
    
    if (record) {
      res.status(201).json(record);
    } else {
      res.status(400).json({ message: 'Invalid record data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private
const updateRecord = async (req, res) => {
  const { description, observations, therapistId } = req.body;
  
  try {
    const record = await Record.findById(req.params.id);
    
    if (record) {
      record.description = description || record.description;
      record.observations = observations || record.observations;
      
      // If therapist changed, update therapist name too
      if (therapistId && therapistId !== record.therapistId.toString()) {
        const therapist = await User.findById(therapistId);
        
        if (!therapist) {
          return res.status(404).json({ message: 'Therapist not found' });
        }
        
        record.therapistId = therapistId;
        record.therapistName = therapist.name;
      }
      
      const updatedRecord = await record.save();
      res.json(updatedRecord);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (record) {
      await record.deleteOne();
      res.json({ message: 'Record removed' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getRecords, 
  getRecordsByPatient, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  deleteRecord 
};
