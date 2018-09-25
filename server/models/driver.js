const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  address: String,
  contact: String,
  email: String,
  driverCab: String,
  cabMake: String,
  cabModel: String,
  cabRegister: String
});

module.exports = mongoose.model('driver', driverSchema);
