const mongoose = require('mongoose');

const ridesSchema = mongoose.Schema({
  customer: {
    name: String,
    email: String,
    contact: String
  },
  driver: {
    name: String,
    email: String,
    contact: String
  },
  pickup: String,
  destination: String,
  fare: String,
  date: String,
  time: String,
  ongoing: Boolean
});

module.exports = mongoose.model('ride', ridesSchema);
