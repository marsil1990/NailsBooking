const utilitiesDate = require("../utilities/available-Dates");
const utilities = require("../utilities/index");
const reservationModel = require("../models/reservation-model");

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
  console.log(new_date);
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
    console.error(err);
    res.status(500).json({ ok: false, message: "DB error" });
  }
}
module.exports = {
  appointments,
  booking,
  getManagementReservations,
  managemenReservations,
  getAvailableDates,
};
