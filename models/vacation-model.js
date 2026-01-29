const pool = require("../database/index");

async function getAll() {
  try {
    const result = await pool.query("SELECT * FROM public.vacation");
    return result.rows;
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

async function deleteByid(v_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.vacation WHERE vacation_id = $1",
      [v_id],
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

module.exports = {
  getAll,
  deleteByid,
};
