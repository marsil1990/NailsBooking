const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const validate = require("../utilities/serviceValidation");
const appointmentsController = require("../controllers/appointmentsController");

router.get(
  "/",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.appointments)
);

router.post(
  "/book",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.booking)
);

module.exports = router;
