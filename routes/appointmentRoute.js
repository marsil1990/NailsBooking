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
  utilities.authorize,
  utilities.handleErrors(appointmentsController.getToEeditReservations),
);

router.post(
  "/edit",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.editReservations),
);

router.get(
  "/delete/:reservation_id",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.getTodelete),
);

router.post(
  "/delete",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.deleteReservation),
);

router.get(
  "/myOwnAppointment/:account_id",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.getReservationsClient),
);

router.get(
  "/myOwnAppointment",
  utilities.authorize,
  utilities.handleErrors(appointmentsController.getMyreservations),
);

router.get(
  "/deletevacation/:vacation_id",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.deleteVacations),
);

router.get(
  "/deletedisabledhours/:disabledhours_id",
  utilities.authorizeAdmin,
  utilities.handleErrors(appointmentsController.deleteDisabledHours),
);

module.exports = router;
