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

module.exports = {
  appointments,
  booking,
};
