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
    return res.redirect("/account");
  }
}

async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return next(err);
      }
      res.clearCookie("sessionId");
      res.clearCookie("jwt");

      return res.status(400).redirect("/");
    });
  } catch (erro) {
    console.error("Logout error:", error);
  }
}

async function buildManagement(req, res) {
  res.render("account/management", {
    title: "Mi cuenta",
  });
}

async function getAccountToEdit(req, res) {
  const id = req.params.account_id;
  const account = await accountModel.getAccountById(id);
  if (account) {
    const { account_id, account_firstname, account_lastname, account_email } =
      account;
    res.render("account/account-edit", {
      title: "Edita tu información",
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }
}

async function editAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  const accountEdit = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (accountEdit === 1) {
    req.flash("notice", "Su información ha sido editada correctamente");
    res.redirect("/account");
  } else {
    req.flash("notice", "Error durante el proceso de edición");
    res.status(500).render("account/account-edit", {
      title: "Edita tu información",
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }
}

async function editPassword(req, res) {
  const { account_id, account_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.editPassword(account_id, hashedPassword);
    if (result === 1) {
      req.flash("notice", "La contraseña ha sido modificada correctamente");
      res.redirect("/account");
    } else {
      req.flash("notice", "La contraseña no ha sido modificada correctamente");
      res.redirect("/account");
    }
  } catch (error) {
    console.error("Error editando password", error.message);
    res.status(500).redirect("/account");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  register,
  accountLogin,
  buildManagement,
  logout,
  getAccountToEdit,
  editAccount,
  editPassword,
};
