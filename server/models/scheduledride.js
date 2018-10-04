const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  customer: {
    name: String,
    email: String,
    contact: String
  },
  pickup: String,
  destination: String,
  fare: String,
  date: String,
  time: String,
  driver: {
    name: String,
    email: String,
    contact: String
  }
});

module.exports = mongoose.model('scheduleride', scheduleSchema);
