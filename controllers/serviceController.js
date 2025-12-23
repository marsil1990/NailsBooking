const serviceModel = require("../models/service-model");
const utilities = require("../utilities/index");
const path = require("path");
const fs = require("fs");

async function buildServiceAdmin(req, res) {
  const data = await serviceModel.getAllservices();
  const grid = await utilities.buildServicesAdmin(data);
  res.render("service/service", {
    title: "Servicios Disponibles",
    grid: grid,
  });
}

async function buildAddService(req, res) {
  res.render("service/add-service", {
    title: "Agrega un nuevo Servicio",
  });
}

async function addNewService(req, res) {
  try {
    const { service_name, service_description, service_price } = req.body;
    let service_imageurl = null;
    if (req.file) {
      service_imageurl = `/images/services/${req.file.filename}`;
    }
    const service = await serviceModel.insertService(
      service_name,
      service_description,
      service_price,
      service_imageurl
    );
    if (service !== 1) {
      req.flash("notice", "Error al agregar un servicio");
      res.status(500).render("service/add-service", {
        service_name,
        service_description,
        service_price,
        service_imageurl,
      });
    } else {
      req.flash("notice", "El servicio se agrego correctamente");
      res.redirect("/service");
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "Error al agregar un servicio");
    res.status(500).render("service/add-service", {
      service_name,
      service_descritpion,
      service_price,
      service_imageurl,
    });
  }
}

async function getServiceToEdit(req, res) {
  const service_by_id = req.params.service_id;
  const service = await serviceModel.getServiceById(service_by_id);
  const {
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl,
  } = service;

  console.log(
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl
  );
  res.render("service/edit-service", {
    title: "Editar",
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl,
  });
}

async function editService(req, res) {
  try {
    const {
      service_id,
      service_name,
      service_description,
      service_price,
      current_image,
    } = req.body;

    let imagePath = current_image;
    console.log(req.file, imagePath);
    // Si el usuario sube una nueva imagen
    if (req.file) {
      imagePath = `/images/services/${req.file.filename}`;

      // Borrar imagen anterior SOLO si no es la imagen por defecto
      if (current_image && current_image !== "/images/no-image.png") {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          current_image
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err.message);
          }
        });
      }
    }

    const editResult = await serviceModel.updateService(
      service_id,
      service_name,
      service_description,
      service_price,
      imagePath
    );

    if (editResult === 1) {
      req.flash("notice", "Servicio editado con éxito");
      return res.redirect("/service");
    } else {
      req.flash("notice", "No se pudo editar el servicio");
      return res.render("service/edit-service", {
        title: "Editar",
        service_id,
        service_name,
        service_description,
        service_price,
        current_image,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "Ocurrió un error inesperado");
    return res.redirect("/service");
  }
}

async function getServiceToDelete(req, res) {
  const service_by_id = req.params.service_id;
  const service = await serviceModel.getServiceById(service_by_id);
  const {
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl,
  } = service;

  console.log(
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl
  );
  res.render("service/delete-service", {
    title: "Eliminar",
    service_id,
    service_name,
    service_description,
    service_price,
    services_imageurl,
  });
}

async function deleteService(req, res) {
  const service_id = req.body.service_id;
  const service = await serviceModel.deleteServiceById(service_id);
  if (service === 1) {
    const imagePath = req.body.services_imageurl;

    // evitar borrar imagen por defecto
    if (imagePath && imagePath !== "/images/no-image.png") {
      const fullPath = path.join(__dirname, "..", "public", imagePath);

      fs.unlink(fullPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting image:", err.message);
        }
      });
    }
    req.flash(
      "notice",
      `El servicio ${req.body.service_name} se ha eliminado correctamente`
    );
    res.redirect("/service");
  } else {
    req.flash(
      "notice",
      `El servicio ${req.body.service_name} no se ha eliminado, intente otra vez`
    );
    res.redirect("/service");
  }
}
module.exports = {
  buildServiceAdmin,
  buildAddService,
  addNewService,
  getServiceToEdit,
  editService,
  getServiceToDelete,
  deleteService,
};
