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

router.get(
  "/managementReservations",
  utilities.handleErrors(appointmentsController.getManagementReservations)
);

router.post(
  "/managementReservations",
  utilities.handleErrors(appointmentsController.managemenReservations)
);

router.get(
  "/avaiable-dates",
  utilities.handleErrors(appointmentsController.getAvailableDates)
);

router.post(
  "/schedule-not-available",
  utilities.handleErrors(appointmentsController.disableHours)
);

router.get(
  "/reservations",
  utilities.handleErrors(appointmentsController.getReservationsMadeByClients)
);
module.exports = router;
