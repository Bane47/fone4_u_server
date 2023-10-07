const express = require('express');
const router = express.Router();
const phonesModel = require('../models/phones');
const { body, validationResult } = require('express-validator');

// Validation middleware for the request body
const validatePhoneData = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('processor').trim().notEmpty().withMessage('Processor is required'),
  body('ram').trim().notEmpty().withMessage('RAM is required'),
  body('battery').trim().notEmpty().withMessage('Battery is required'),
  body('camera').trim().notEmpty().withMessage('Camera is required'),
  body('storage').trim().notEmpty().withMessage('Storage is required'),
  body('display').trim().notEmpty().withMessage('Display is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
];

// Custom error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /post - Create a new phone record
router.post('/post', async (req, res) => {
  try {
    const { name, processor, ram, battery, camera, storage, display, price, image } = req.body;

    // Perform any necessary data validation here

    const phoneDetails = await phonesModel.create({
      name,
      processor,
      ram,
      battery,
      camera,
      storage,
      display,
      price,
      image
    });

    res.status(201).json(phoneDetails); // Respond with a 201 status code for successful creation
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /getPhones - Retrieve all phone records
router.get('/getPhones', async (req, res) => {
  try {
    const allPhones = await phonesModel.find();
    res.status(200).json(allPhones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /edit/:id - Update an existing phone record
router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPhoneData = req.body;

    const updatedPhone = await phonesModel.findByIdAndUpdate(id, updatedPhoneData, { new: true });

    if (!updatedPhone) {
      return res.status(404).json({ error: 'Phone not found' });
    }

    res.status(200).json(updatedPhone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /delete/:id - Delete a phone record
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhone = await phonesModel.findByIdAndDelete(id);

    if (!deletedPhone) {
      return res.status(404).json({ error: 'Phone not found' });
    }

    res.status(200).json({ message: 'Phone deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
