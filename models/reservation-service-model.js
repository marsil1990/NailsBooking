const { Result } = require("pg");
const pool = require("../database/index");
async function insertServiceToreservation(reservation_id, service_id) {
  try {
    const resutl = await pool.query(
      "INSERT INTO public.reservations_services (reservation_id, service_id) VALUES ($1, $2)",
      [parseInt(reservation_id), parseInt(service_id)]
    );
    return resutl.rowCount;
  } catch (error) {
    console.error("DB error: ", error.message);
    throw error;
  }
}

module.exports = {
  insertServiceToreservation,
};
