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
  const insertBook = await reservationModel.insertBook(account_email, new_date);
  const dates = await utilitiesDate.availableDatesForBook();
  const grid = await utilities.buildSelectdates(dates);
  if (insertBook === 1) {
    req.flash("notice", "Se ha agendado correctamente");
    res.redirect("/appointment");
  } else {
    req.flash(
      "notice",
      "Hubo un problema durante el proceso, intentelo de nuevo",
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

// async function managemenReservations(req, res) {
//   const start = new Date(req.body.startDay);
//   const end = new Date(req.body.endDay);
//   const insertVacation = await reservationModel.insertVacation(start, end);
//   if (insertVacation === 1) {
//     req.flash("notice", "Las vacaciones se han agendado correctamente");
//     res.redirect("/appointment/managementReservations");
//   } else {
//     req.flash(
//       "notice",
//       "Las vacaciones no se han agendado correctamente, intentelo de nuevo",
//     );
//     res.redirect("/appointment/managementReservations");
//   }
// }

/* MANAGEMENT VACATIONS */

async function getManagementVacations(req, res) {
  res.render("appointment/appointment-management-vacations", {
    title: "Gestiona las reservas",
    errors: null,
  });
}

async function managemenVacations(req, res) {
  const start = new Date(req.body.startDay);
  const end = new Date(req.body.endDay);
  console.log(start, end);
  const insertVacation = await reservationModel.insertVacation(start, end);
  if (insertVacation === 1) {
    req.flash("notice", "Las vacaciones se han agendado correctamente");
    res.redirect("/appointment/managementVacations");
  } else {
    req.flash(
      "notice",
      "Las vacaciones no se han agendado correctamente, intentelo de nuevo",
    );
    res.redirect("/appointment/managementVacations");
  }
}

async function getAvailableDates(req, res) {
  try {
    const dates = await utilitiesDate.availableDatesForBook();
    res.json({ ok: true, dates:dates.map((d)=>d.getTime())  }); 
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
      "No han eliminados las horas correctamente, intentelo de nuevo",
    );
    res.status(500).redirect("/appointment/managementVacations");
  }
}

async function getToEeditReservations(req, res) {
  console.log("Parametros: ", req.params);

  let currentService = await reservationServiceModel.getserviceByregistration(
    req.params.reservation_id,
  );
  if (!currentService) {
    currentService = "";
  }
  const services = await serviceModel.getAllservices();
  const getDate = await reservationModel.getReservationDate(
    req.params.reservation_id,
  );
  const uruDate = new Date(getDate.appointment_datetime);
  uruDate.setHours(uruDate.getHours() + 3);
  const dateString = uruDate.toLocaleString({
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const selectList = await utilities.buildSelectServices(services);
  const account = await accountModel.getAccountById(req.params.account_id);
  // const dates = await utilitiesDate.availableDatesForBook();
  const dates = await utilitiesDate.availableDatesForEdit(uruDate);
  const grid = await utilities.buildSelectdates(dates);
  res.render("appointment/appointment-edit", {
    title: "Editar",
    selectList,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    reservation_id: req.params.reservation_id,
    dateString,
    grid,
    currentService: currentService.service_name,
  });
}

async function editReservations(req, res) {
  const { serviceReservations, reservation_id } = req.body;

  if (req.body.date !== "Horarios disponibles ↓") {
    const date = new Date(req.body.date);

    date.setHours(date.getHours() - 3);
    const dateUruguay = new Date(date);

    const updatereservation = await reservationModel.updateDateReservation(
      reservation_id,
      dateUruguay,
    );
    if (updatereservation !== 1) {
      req.flash("notice", "No se actualizo correctamente la fecha");
    }
  }

  if (serviceReservations !== "Elige un servicio") {
    const insertToreservationClient =
      await reservationServiceModel.insertServiceToreservation(
        reservation_id,
        serviceReservations,
      );
    if (insertToreservationClient === 1) {
      req.flash("notice", "Se editado con exito");
      res.redirect("/appointment/managementReservations");
    } else {
      req.flash("notice", "Error en el preceso de edición");
      res.redirect("/appointment/managementReservations");
    }
  } else {
    req.flash("notice", "Debes ingresar un servicio si aún no lo has hecho");
    res.redirect("/appointment/managementReservations");
  }
}

async function getTodelete(req, res) {
  const { reservation_id } = req.params;
  const result =
    await reservationModel.getDateForDeleteReservation(reservation_id);
  let {
    account_firstname,
    account_lastname,
    account_email,
    appointment_datetime,
    service_name,
    service_description,
    service_price,
    created_at,
  } = result;
  appointment_datetime.setHours(appointment_datetime.getHours() + 3);
  appointment_datetime = appointment_datetime.toLocaleString("es-UY", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  created_at = created_at.toLocaleString("es-UY", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  res.render("appointment/appointment-delete", {
    account_firstname,
    account_lastname,
    account_email,
    appointment_datetime,
    service_name,
    service_description,
    service_price,
    created_at,
    reservation_id,
    title: "Confirme si quiere eliminar",
    errors: null,
  });
}

async function deleteReservation(req, res) {
  const { reservation_id } = req.body;
  console.log(req.body);
  const deleteResult =
    await reservationModel.deleteReservationByid(reservation_id);
  if (deleteResult === 1) {
    req.flash("notice", "La eliminación fue un exito!");
    res.redirect("/appointment/managementReservations");
  } else {
    req.flash("notice", "¨Se produjo un errror al eliminar!");
    res.redirect("/appointment/managementReservations");
  }
}

module.exports = {
  appointments,
  booking,
  getManagementReservations,
  // managemenReservations,
  getAvailableDates,
  disableHours,
  getReservationsMadeByClients,
  getToEeditReservations,
  editReservations,
  getManagementVacations,
  managemenVacations,
  getTodelete,
  deleteReservation,
};
