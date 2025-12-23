const pool = require("../database/index");
const { get } = require("../routes/static");

async function getAllservices() {
  try {
    const query = "SELECT * FROM public.services";
    const services = await pool.query(query);
    return services.rows;
  } catch (error) {
    return error.message;
  }
}

async function insertService(name, description, price, imgurl) {
  try {
    const query =
      "INSERT INTO public.services (service_name, service_description, service_price, services_imageurl) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [name, description, price, imgurl]);
    return result.rowCount;
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

async function getServiceById(service_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.services WHERE service_id = $1",
      [service_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

async function updateService(
  service_id,
  service_name,
  service_description,
  service_price,
  imagePath
) {
  try {
    const result = await pool.query(
      "UPDATE public.services SET service_name = $1, service_description = $2, service_price = $3, services_imageurl = $4 WHERE service_id = $5 RETURNING*",
      [service_name, service_description, service_price, imagePath, service_id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

async function deleteServiceById(id) {
  try {
    const result = await pool.query(
      "DELETE FROM services WHERE service_id = $1",
      [id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error:", error.message);
    throw error;
  }
}

module.exports = {
  getAllservices,
  insertService,
  getServiceById,
  updateService,
  deleteServiceById,
};
