const { body, validationResult } = require("express-validator");
const validate = {};

validate.newServiceRules = () => {
  return [
    body("service_name")
      .trim()
      .notEmpty()
      .withMessage("Provide a name.")
      .bail()
      .matches(/^[A-Za-z0-9][A-Za-z0-9 \-]{2,}$/)
      .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),

    body("service_description")
      .trim()
      .notEmpty()
      .withMessage("Provide a description.")
      .bail()
      .isLength({ min: 10 })
      .withMessage("Min 10 characters."),

    body("service_price")
      .trim()
      .notEmpty()
      .withMessage("Provide a price.")
      .bail()
      .matches(/^\d+(?:\.\d{1,2})?$/)
      .withMessage(
        "Use an integer or a decimal with up to 2 decimals (e.g., 12000 or 12000.99)."
      ),
  ];
};

validate.checkNewServiceData = async (req, res, next) => {
  const { service_name, service_description, service_price } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((e) => req.flash("notice", e.msg));
    res.render("service/add-service", {
      title: "Agregar servicio",
      service_name,
      service_description,
      service_price,
    });
    return;
  } else {
    next();
  }
};

module.exports = validate;
