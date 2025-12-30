const jwt = require("jsonwebtoken");
Util = {};

Util.buildServicesMarquee = (data) => {
  let grid = "";

  if (data.length > 0) {
    grid += '<section class="marquee">';
    grid += '<div class="marquee-track">';

    // 🔁 Primera pasada
    data.forEach((service) => {
      grid += `
        <div class="item">
          <img 
            src="${service.services_imageurl}" 
            width="200" 
            height="200" 
            alt="${service.service_name}"
            loading="lazy"
          >
        </div>
      `;
    });

    // 🔁 Segunda pasada (duplicado para efecto infinito)
    data.forEach((service) => {
      grid += `
        <div class="item">
          <img 
            src="${service.services_imageurl}" 
            width="200" 
            height="200" 
            alt="${service.service_name}"
            loading="lazy"
          >
        </div>
      `;
    });

    grid += "</div>";
    grid += "</section>";
  } else {
    grid += '<p class="notice">No hay imágenes para mostrar</p>';
  }

  return grid;
};

Util.buildServicesCards = (data) => {
  let grid = "";

  if (data.length > 0) {
    grid += '<section class="section-services">';
    grid += "<h2>SERVICIOS</h2>";

    data.forEach((service) => {
      grid += `
        <article class="card">
          <h3>${service.service_name}</h3>

          <img 
            src="${service.services_imageurl}" 
            alt="${service.service_name}" 
            width="100" 
            height="100">

          <p>${service.service_description}</p>
        </article>
      `;
    });

    grid += "</section>";
  } else {
    grid += '<p class="notice">No hay servicios disponibles</p>';
  }

  return grid;
};

Util.buildServicesAdmin = async (data) => {
  let grid = "";
  if (data.length > 0) {
    grid = '<table class="servicesTable">';
    grid += "<thead>";
    grid += "<tr>";
    grid += "<td> Nombre </td>";
    grid += "<td>  Descripción </td>";
    grid += "<td> Precio ($) </td>";
    grid += "</tr>";
    grid += "</thead>";
    grid += "<tbody>";
    data.forEach((element) => {
      grid += "<tr>";
      grid += "<td> " + element.service_name + " </td>";
      grid += "<td> " + element.service_description + " </td>";
      grid += "<td> " + element.service_price + " </td>";
      grid +=
        "<td> <a href= service/" + element.service_id + ">Editar</a></td>";
      grid +=
        "<td> <a href= service/delete/" +
        element.service_id +
        ">Eliminar</a></td>";
      grid += "</tr>";
    });
    grid += "</tbody>";
    grid += "</table>";
  } else {
    grid += '<p class="notice"> No hay servicios disponibles </P>';
  }
  return grid;
};



Util.buildSelectdates = async (dates) => {
  grid = "";
  if (dates.length === 0) {
    grid = "<p> No hay horarios disponibles </p>";
  } else {
    grid = '<select name="date" id="date">';
    grid += "<option> Loading ... </option>";
    dates.forEach((d) => {
      grid += `<option value ="${d}">`;
      grid += d.toLocaleString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      grid += "</option>";
    });
    grid += "</select>";
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.accountData != null;
  res.locals.loggedin = false;
  res.locals.userName = null;
  res.locals.type = null;
  res.locals.account_id = null;
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.loggedin = true;
        res.locals.userName = accountData.account_firstname;
        res.locals.type = accountData.account_type;
        res.locals.account_id = accountData.account_id;
        next();
      }
    );
  } else {
    next();
  }
};

Util.authorize = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please Log in");
    res.redirect("/account/login");
  } else {
    next();
  }
};

Util.authorizeAdmin = (req, res, next) => {
  if (res.locals.loggedin && res.locals.type === "Admin") {
    next();
    return;
  } else {
    req.flash("notice", "Please Log in");
    res.redirect("/account/login");
  }
};

module.exports = Util;
