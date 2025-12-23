const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const validate = require("../utilities/serviceValidation");

const serviceController = require("../controllers/serviceController");
const upload = require("../utilities/upload");

router.get("/", utilities.handleErrors(serviceController.buildServiceAdmin));
router.get(
  "/new-service",
  utilities.handleErrors(serviceController.buildAddService)
);

router.post(
  "/new-service",
  upload.single("service_imageurl"),
  validate.newServiceRules(),
  validate.checkNewServiceData,
  utilities.handleErrors(serviceController.addNewService)
);

router.get(
  "/:service_id",
  utilities.handleErrors(serviceController.getServiceToEdit)
);

router.get(
  "/delete/:service_id",
  utilities.handleErrors(serviceController.getServiceToDelete)
);

router.post(
  "/update",
  upload.single("service_new_image"),
  utilities.handleErrors(serviceController.editService)
);

router.post("/delete", utilities.handleErrors(serviceController.deleteService));

module.exports = router;
