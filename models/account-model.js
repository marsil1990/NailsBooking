const pool = require("../database/index");

async function checkExistingEmail(account_mail) {
  try {
    const query = "SELECT account_email FROM account WHERE account_email =$1";
    const result = await pool.query(query, [account_mail]);
    return result.rowCount;
  } catch (e) {
    return e.message;
  }
}

async function resgister(fname, lname, email, password) {
  try {
    const resutl = await pool.query(
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *",
      [fname, lname, email, password]
    );
    console.log(resutl);
    return resutl;
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  checkExistingEmail,
  resgister,
};
