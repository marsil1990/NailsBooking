const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const validate = require("../utilities/serviceValidation");

const serviceController = require("../controllers/serviceController");
const upload = require("../utilities/upload");

router.get(
  "/",
  utilities.authorizeAdmin,
  utilities.handleErrors(serviceController.buildServiceAdmin)
);
router.get(
  "/new-service",
  utilities.authorizeAdmin,
  utilities.handleErrors(serviceController.buildAddService)
);

router.post(
  "/new-service",
  utilities.authorizeAdmin,
  upload.single("service_imageurl"),
  validate.newServiceRules(),
  validate.checkNewServiceData,
  utilities.handleErrors(serviceController.addNewService)
);

router.get(
  "/:service_id",
  utilities.authorizeAdmin,

  utilities.handleErrors(serviceController.getServiceToEdit)
);

router.get(
  "/delete/:service_id",
  utilities.authorizeAdmin,
  utilities.handleErrors(serviceController.getServiceToDelete)
);

router.post(
  "/update",
  utilities.authorizeAdmin,
  upload.single("service_new_image"),
  validate.newServiceRules(),
  validate.checkNewServiceData,
  utilities.handleErrors(serviceController.editService)
);

router.post(
  "/delete",
  utilities.authorizeAdmin,
  utilities.handleErrors(serviceController.deleteService)
);

module.exports = router;
