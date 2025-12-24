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
    console.error("DB error", error.message);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const query = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error("DB error", error.message);
    throw error;
  }
}

async function getAccountById(id) {
  try {
    const query = "SELECT * FROM account WHERE account_id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("DB error", error.message);
    throw error;
  }
}

async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const result = await pool.query(
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email=$3 WHERE account_id = $4 RETURNING*",
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error", error.message);
    throw error;
  }
}

async function checpdatekExistingEmail(id, email) {
  try {
    const e = await pool.query(
      "SELECT account_email FROM account WHERE account_id = $1",
      [id]
    );
    if (e.rows[0].account_email === email) {
      return false;
    } else {
      const r = await pool.query(
        "SELECT account_email FROM account WHERE account_email = $1",
        [email]
      );
      if (r.rowCount !== 1) {
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    console.error("DB error", error.message);
    throw error;
  }
}

async function editPassword(id, p) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2",
      [p, id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("DB error", error.message);
    throw error;
  }
}

module.exports = {
  checkExistingEmail,
  resgister,
  getUserByEmail,
  getAccountById,
  updateAccount,
  checpdatekExistingEmail,
  editPassword,
};
