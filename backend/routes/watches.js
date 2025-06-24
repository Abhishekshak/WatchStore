const express = require('express');
const router = express.Router();
const multer = require('multer');
const Watch = require('../models/watch');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// CREATE - Add new watch
router.post('/', upload.array('images', 4), async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      discountedPrice,
      description,
      features,
      specifications,
      gender,
      displayInHome
    } = req.body;

    // Parse JSON fields safely
    const parsedFeatures = features ? JSON.parse(features) : [];
    const parsedSpecifications = specifications ? JSON.parse(specifications) : {};

    // Ensure parsedSpecifications keys are camelCase as expected
    // e.g., { movement, caseMaterial, waterResistance, strap }

    const images = req.files ? req.files.map(file => file.path) : [];

    const newWatch = new Watch({
      name,
      brand,
      price,
      discountedPrice: discountedPrice || undefined,
      description,
      features: parsedFeatures,
      specifications: parsedSpecifications,
      images,
      gender,
      displayInHome: displayInHome === 'true' || displayInHome === true
    });

    await newWatch.save();
    res.status(201).json({ message: 'Watch added successfully', watch: newWatch });
  } catch (error) {
    console.error('Error adding watch:', error);
    res.status(500).json({ message: 'Failed to add watch' });
  }
});

// READ - Get all watches, optionally filtered & randomized by displayInHome
router.get('/', async (req, res) => {
  try {
    const { displayInHome } = req.query;

    if (displayInHome === 'true') {
      const count = await Watch.countDocuments({ displayInHome: true });

      if (count > 4) {
        const watches = await Watch.aggregate([
          { $match: { displayInHome: true } },
          { $sample: { size: 4 } }
        ]);
        return res.json({ watches });
      } else {
        const watches = await Watch.find({ displayInHome: true });
        return res.json({ watches });
      }
    }

    const watches = await Watch.find();
    res.json({ watches });
  } catch (error) {
    console.error('Error fetching watches:', error);
    res.status(500).json({ message: 'Failed to fetch watches' });
  }
});

// READ - Get watch by ID
router.get('/:id', async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) return res.status(404).json({ message: 'Watch not found' });
    res.json(watch);
  } catch (error) {
    console.error('Error fetching watch:', error);
    res.status(500).json({ message: 'Failed to fetch watch' });
  }
});

// UPDATE - Update watch by ID
router.put('/:id', upload.array('images', 4), async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      discountedPrice,
      description,
      features,
      specifications,
      gender,
      displayInHome
    } = req.body;

    const watch = await Watch.findById(req.params.id);
    if (!watch) return res.status(404).json({ message: 'Watch not found' });

    // Update fields only if provided, else keep old
    watch.name = name ?? watch.name;
    watch.brand = brand ?? watch.brand;
    watch.price = price ?? watch.price;
    watch.discountedPrice = discountedPrice ?? watch.discountedPrice;
    watch.description = description ?? watch.description;
    watch.features = features ? JSON.parse(features) : watch.features;
    watch.specifications = specifications ? JSON.parse(specifications) : watch.specifications;
    watch.gender = gender ?? watch.gender;

    if (typeof displayInHome !== 'undefined') {
      watch.displayInHome = displayInHome === 'true' || displayInHome === true;
    }

    // Only replace images if new files uploaded
    if (req.files && req.files.length > 0) {
      watch.images = req.files.map(file => file.path);
    }

    await watch.save();
    res.json({ message: 'Watch updated successfully', watch });
  } catch (error) {
    console.error('Error updating watch:', error);
    res.status(500).json({ message: 'Failed to update watch' });
  }
});

// DELETE - Delete watch by ID
router.delete('/:id', async (req, res) => {
  try {
    const watch = await Watch.findByIdAndDelete(req.params.id);
    if (!watch) return res.status(404).json({ message: 'Watch not found' });
    res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    console.error('Error deleting watch:', error);
    res.status(500).json({ message: 'Failed to delete watch' });
  }
});

module.exports = router;
