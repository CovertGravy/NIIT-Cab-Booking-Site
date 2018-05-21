const express = require("express");

//models here
const tariff = require("../models/tariff");
// router

const router = express.Router();

// APIs
router.post("/addtariff", (req, res) => {
  let newTariff = new tariff();
});

module.exports = router;
