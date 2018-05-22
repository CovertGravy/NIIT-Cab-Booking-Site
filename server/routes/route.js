const express = require("express");

//models here
const tariff = require("../models/tariff");
// router

const router = express.Router();

// APIs
router.post("/addtariff", (req, res) => {
  let newTariff = new tariff(req.body);
  // newTariff.cabType = req.body.cabType;

  newTariff.save((err, doc) => {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: "Record added!"
      });
    }
  });
});

router.get("/showtariff", (req, res) => {
  tariff.find({}, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
