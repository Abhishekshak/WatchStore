const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  discountedPrice: Number,
  description: String,
  features: [String],
  specifications: {
    movement: String,
    caseMaterial: String,
    waterResistance: String,
    strap: String,
  },
  images: [String],
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex',
  },
  displayInHome: {
    type: Boolean,
    default: false,
  },
});

const Watch = mongoose.model('Watch', watchSchema);
module.exports = Watch;
