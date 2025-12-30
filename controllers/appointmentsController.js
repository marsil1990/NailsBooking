const utilitiesDate = require("../utilities/available-Dates");
const utilities = require("../utilities/index");
const reservationModel = require("../models/reservation-model");
const serviceModel = require("../models/service-model");
const accountModel = require("../models/account-model");
const reservationServiceModel = require("../models/reservation-service-model");

async function appointments(req, res) {
  const dates = await utilitiesDate.availableDatesForBook();
  const grid = await utilities.buildSelectdates(dates);
  res.render("appointment/appointments", {
    title: "Reserva Web",
    grid,
    errors: null,
  });
}

async function booking(req, res) {
  const { account_email, date } = req.body;
  const new_date = new Date(date);
  console.log(req.body, account_email);
  const insertBook = await reservationModel.insertBook(account_email, new_date);
  const dates = await utilitiesDate.availableDatesForBook();
  const grid = await utilities.buildSelectdates(dates);
  if (insertBook === 1) {
    req.flash("notice", "Se ha agendado correctamente");
    res.redirect("/appointment");
  } else {
    req.flash(
      "notice",
      "Hubo un problema durante el proceso, intentelo de nuevo"
    );
    res.render("appointment/appointments", {
      title: "Reserva Web",
      grid,
      errors: null,
    });
  }
}

async function getManagementReservations(req, res) {
  res.render("appointment/appointment-management", {
    title: "Gestiona las reservas",
    errors: null,
  });
}

async function managemenReservations(req, res) {
  const start = new Date(req.body.startDay);
  const end = new Date(req.body.endDay);
  const insertVacation = await reservationModel.insertVacation(start, end);
  if (insertVacation === 1) {
    req.flash("notice", "Las vacaciones se han agendado correctamente");
    res.redirect("/appointment/managementReservations");
  } else {
    req.flash(
      "notice",
      "Las vacaciones no se han agendado correctamente, intentelo de nuevo"
    );
    res.redirect("/appointment/managementReservations");
  }
}

async function getAvailableDates(req, res) {
  try {
    const dates = await utilitiesDate.availableDatesForBook();
    res.json({ ok: true, dates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "DB error" });
  }
}

async function getReservationsMadeByClients(req, res) {
  try {
    const dates = await reservationModel.getReservationsClient();
    res.json({ ok: true, dates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "DB error" });
  }
}

async function disableHours(req, res) {
  const { not_available_times } = req.body;
  try {
    not_available_times.forEach(async (h) => {
      await reservationModel.insertDisableHours(new Date(h));
    });
    req.flash("notice", "Se han eliminados las horas correctamente");
    res.redirect("/appointment/managementReservations");
  } catch (error) {
    req.flash(
      "notice",
      "No han eliminados las horas correctamente, intentelo de nuevo"
    );
    res.status(500).redirect("/appointment/managementReservations");
  }
}

async function getToEeditReservations(req, res) {
  console.log(req.params);
  const services = await serviceModel.getAllservices();
  const selectList = await utilities.buildSelectServices(services);
  const account = await accountModel.getAccountById(req.params.account_id);
  res.render("appointment/appointment-edit", {
    title: "Editar",
    selectList,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    reservation_id: req.params.reservation_id,
  });
}

async function editReservations(req, res) {
  const { serviceReservations, reservation_id } = req.body;
  const insertToreservationClient =
    await reservationServiceModel.insertServiceToreservation(
      reservation_id,
      serviceReservations
    );
  if (insertToreservationClient === 1) {
    req.flash("notice", "Se editado con exito");
    res.redirect("/appointment/managementReservations");
  } else {
    req.flash("notice", "Error en el preceso de edición");
    res.redirect("/appointment/managementReservations");
  }
}

module.exports = {
  appointments,
  booking,
  getManagementReservations,
  managemenReservations,
  getAvailableDates,
  disableHours,
  getReservationsMadeByClients,
  getToEeditReservations,
  editReservations,
};
