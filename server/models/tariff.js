const mongoose = require("mongoose");

const tariffSchema = mongoose.Schema({
  cabType: String,
  normalRate: String,
  peakRate: String,
  peakHourStart: String,
  peakHourEnd: String
});

module.exports = mongoose.model("tariff", tariffSchema);
