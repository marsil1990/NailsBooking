const { Result } = require("pg");
const pool = require("../database/index");

async function insertServiceToreservation(reservation_id, service_id) {
  try {
    const exist = await pool.query(
      "SELECT * FROM public.reservations_services WHERE reservation_id = $1",
      [reservation_id]
    );
    let result;
    if (exist.rowCount !== 1) {
      result = await pool.query(
        "INSERT INTO public.reservations_services (reservation_id, service_id) VALUES ($1, $2) RETURNING*",
        [parseInt(reservation_id), parseInt(service_id)]
      );
    } else {
      result = await pool.query(
        "UPDATE public.reservations_services SET service_id = $1 WHERE reservation_id = $2 RETURNING*",
        [service_id, reservation_id]
      );
    }
    return result.rowCount;
  } catch (error) {
    console.error("DB error: ", error.message);
    throw error;
  }
}

module.exports = {
  insertServiceToreservation,
};
