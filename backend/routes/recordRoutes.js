
const express = require('express');
const router = express.Router();
const { 
  getRecords, 
  getRecordsByPatient, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRecords)
  .post(protect, createRecord);

router.get('/patient/:patientId', protect, getRecordsByPatient);

router.route('/:id')
  .get(protect, getRecordById)
  .put(protect, updateRecord)
  .delete(protect, deleteRecord);

module.exports = router;
