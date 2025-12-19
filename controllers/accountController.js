const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
async function buildLogin(req, res) {
  res.render("account/login", {
    title: "Login",
    errors: null,
  });
}

async function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    errors: null,
  });
}

async function register(req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      errors: null,
    });
  }

  const result = await accountModel.resgister(
    account_email,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (result) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  register,
};
