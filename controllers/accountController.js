const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    account_firstname,
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

async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  const user = await accountModel.getUserByEmail(account_email);
  let match;
  try {
    match = await bcrypt.compare(account_password, user.account_password);
  } catch (error) {
    req.flash("notice", "Error in the process");
    res.redirect("/login/");
  }
  if (!match) {
    req.flash("notice", "Incorrect Password");
    res.status(400).render("account/login", {
      title: "Login",
      errors: null,
      account_email,
    });
    return;
  } else {
    delete user.account_password;
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    req.flash("notice", `Welcome! ${user.account_firstname} `);
    return res.redirect("/account/login");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  register,
  accountLogin,
};
