const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const validate = require("../utilities/serviceValidation");
const appointmentsController = require("../controllers/appointmentsController");

router.get(
  "/",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.appointments),
);

router.post(
  "/book",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.booking),
);

router.get(
  "/managementReservations",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.getManagementReservations),
);

router.get(
  "/managementVacations",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.getManagementVacations),
);

router.post(
  "/managementVacations",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.managemenVacations),
);

router.get(
  "/avaiable-dates",
  utilities.handleErrors(appointmentsController.getAvailableDates),
);

router.post(
  "/schedule-not-available",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.disableHours),
);

router.get(
  "/reservations",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.getReservationsMadeByClients),
);

router.get(
  "/edit/:reservation_id/:account_id",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.getToEeditReservations),
);

router.post(
  "/edit",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.editReservations),
);

router.get(
  "/delete/:reservation_id",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.getTodelete),
);

router.post(
  "/delete",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.deleteReservation),
);
module.exports = router;
