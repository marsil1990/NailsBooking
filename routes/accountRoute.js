const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const validate = require("../utilities/accountValidation");
const accountController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.register)
);

router.post(
  "/login",
  validate.loginRules(),
  validate.checkLogin,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/",
  utilities.authorize,
  utilities.handleErrors(accountController.buildManagement)
);

router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
