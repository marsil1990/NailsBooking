const pool = require("../database/index");

async function getReservationsDates() {
  try {
    const result = await pool.query(
      "SELECT appointment_datatime FROM reservations"
    );
    return result.rows;
  } catch (error) {
    console.error("DB error: ", error.message);
    throw error;
  }
}

async function insertBook(email, date) {
  console.log(email);
  try {
    const result = await pool.query(
      "INSERT INTO reservations (account_id, appointment_datatime) VALUES ((SELECT account_id FROM account WHERE account_email = $1), $2) RETURNING*",
      [email, date]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function insertVacation(start, end) {
  try {
    const result = await pool.query(
      "INSERT INTO public.vacation (datestart, dateend) VALUES ($1, $2) RETURNING*",
      [start, end]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}
async function getAllVacations() {
  try {
    date = new Date();
    const result = await pool.query(
      `SELECT *
   FROM public.vacation
   WHERE datestart >= $1::timestamp or dateend >= $1::timestamp`,
      [date.toISOString().slice(0, 19).replace("T", " ")]
    );
    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function insertDisableHours(h) {
  try {
    await pool.query(
      "INSERT INTO public.disableHours (time_disabled) VALUES ($1)",
      [h]
    );
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getAlldisablehours() {
  try {
    const result = await pool.query(
      "SELECT time_disabled FROM public.disableHours"
    );
    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getReservationsClient() {
  try {
    const query =
      "SELECT r.reservation_id, r.account_id, r.appointment_datatime, r.created_at, a.account_firstname, a.account_lastname, a.account_email,s.service_id, s.service_name, s.service_description, s.service_price FROM public.services s INNER JOIN public.reservations_services rs ON rs.service_id = s.service_id RIGHT JOIN public.reservations r ON rs.reservation_id = r.reservation_id INNER JOIN  public.account a ON r.account_id = a.account_id ORDER BY r.appointment_datatime ";
    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

module.exports = {
  getReservationsDates,
  insertBook,
  insertVacation,
  getAllVacations,
  insertDisableHours,
  getAlldisablehours,
  getReservationsClient,
};
