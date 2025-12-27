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

module.exports = {
  getReservationsDates,
  insertBook,
};
