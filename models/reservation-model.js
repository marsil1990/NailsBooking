const pool = require("../database/index");

async function getReservationsDates() {
  try {
    const result = await pool.query(
      "SELECT appointment_datetime FROM reservations",
    );
    return result.rows;
  } catch (error) {
    console.error("DB error: ", error.message);
    throw error;
  }
}

async function insertBook(email, date) {
  try {
    const uruDate = new Date(date.setHours(date.getHours() - 3));
    const result = await pool.query(
      "INSERT INTO reservations (account_id, appointment_datetime) VALUES ((SELECT account_id FROM account WHERE account_email = $1), $2) RETURNING*",
      [email, uruDate],
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function insertVacation(start, end) {
  try {
    const d = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    const result = await pool.query(
      "INSERT INTO public.vacation (datestart, dateend) VALUES   ($1::timestamptz AT TIME ZONE 'UTC' , $2::timestamptz AT TIME ZONE 'UTC') RETURNING*",
      [start, d],
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
      [date.toISOString().slice(0, 19).replace("T", " ")],
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
      [h],
    );
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getAlldisablehours() {
  try {
    const result = await pool.query("SELECT * FROM public.disableHours");
    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getReservationsClient() {
  try {
    const query =
      "SELECT r.reservation_id, r.account_id, r.appointment_datetime, r.created_at, a.account_firstname, a.account_lastname, a.account_email,s.service_id, s.service_name, s.service_description, s.service_price FROM public.services s INNER JOIN public.reservations_services rs ON rs.service_id = s.service_id RIGHT JOIN public.reservations r ON rs.reservation_id = r.reservation_id INNER JOIN  public.account a ON r.account_id = a.account_id ORDER BY r.appointment_datetime ";
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getReservationDate(r_id) {
  try {
    const result = await pool.query(
      "SELECT appointment_datetime FROM public.reservations WHERE reservation_id = $1",
      [r_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function updateDateReservation(reservation_id, newDate) {
  try {
    const result = await pool.query(
      "UPDATE reservations SET appointment_datetime = $1 WHERE reservation_id = $2 RETURNING*",
      [newDate, reservation_id],
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getReservationsDatesCurrentDate(date) {
  try {
    const urudate = new Date(date.setHours(date.getHours() - 3));
    const result = await pool.query(
      `SELECT appointment_datetime
   FROM public.reservations
   WHERE appointment_datetime <> $1::timestamptz`,
      [urudate], // date puede ser Date o string ISO con zona
    );

    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getDateForDeleteReservation(r_id) {
  try {
    const query =
      "SELECT a.account_firstname, a.account_lastname, a.account_email, r.appointment_datetime, s.service_name, s.service_description, s.service_price, r.created_at FROM public.services s INNER JOIN public.reservations_services rs ON rs.service_id = s.service_id RIGHT JOIN public.reservations r ON rs.reservation_id = r.reservation_id INNER JOIN  public.account a ON r.account_id = a.account_id WHERE r.reservation_id =$1;";
    const result = await pool.query(query, [r_id]);
    return result.rows[0];
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function deleteReservationByid(r_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.reservations WHERE reservation_id = $1",
      [r_id],
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function getMyOwnReservations(account_id) {
  try {
    const query =
      "SELECT r.reservation_id, r.account_id, r.appointment_datetime, r.created_at, a.account_firstname, a.account_lastname, a.account_email,s.service_id, s.service_name, s.service_description, s.service_price FROM public.services s INNER JOIN public.reservations_services rs ON rs.service_id = s.service_id RIGHT JOIN public.reservations r ON rs.reservation_id = r.reservation_id INNER JOIN  public.account a ON r.account_id = a.account_id WHERE a.account_id = $1 ORDER BY r.appointment_datetime ";
    const result = await pool.query(query, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("DB error :", error.message);
    throw error;
  }
}

async function deleteDiabledHours(disabledhours_id) {
  try {
    const query =
      "DELETE FROM public.disablehours WHERE disablehours_id = $1 RETURNING*";
    const result = await pool.query(query, [disabledhours_id]);
    return result.rowCount;
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
  getReservationDate,
  updateDateReservation,
  getReservationsDatesCurrentDate,
  getDateForDeleteReservation,
  deleteReservationByid,
  getMyOwnReservations,
  deleteDiabledHours,
};
