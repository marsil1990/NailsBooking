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

module.exports = {
  buildLogin,
  buildRegister,
};
