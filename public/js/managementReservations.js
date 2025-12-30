const divReserv = document.getElementById("management-appointments");

async function getData() {
  const res = await fetch("/appointment/reservations");
  const data = await res.json();
  console.log(data.dates);
  buildReservationsAdmin(data.dates);
}

async function buildReservationsAdmin(data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<table class="servicesTable">';
    grid += "<thead>";
    grid += "<tr>";
    grid += "<td> Nombre </td>";
    grid += "<td> Apellido </td>";
    grid += "<td> Email </td>";
    grid += "<td> Fecha y hora </td>";
    grid += "<td>  Nombre del servicio </td>";
    grid += "<td>  Descripción del servicio </td>";
    grid += "<td> Precio ($) </td>";
    grid += "<td> Fecha de creación </td>";
    grid += "</tr>";
    grid += "</thead>";
    grid += "<tbody>";
    data.forEach((element) => {
      const appointment = new Date(element.appointment_datatime); // o appointment_datatime si así viene
      const created = new Date(element.created_at);

      const dateElementappointment = appointment.toLocaleString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const created_at = created.toLocaleString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      grid += "<tr>";
      grid += "<td> " + element.account_firstname + " </td>";
      grid += "<td> " + element.account_lastname + " </td>";
      grid += "<td> " + element.account_email + " </td>";
      grid += "<td> " + dateElementappointment + "</td>";
      if (element.service_name !== null) {
        grid += "<td>" + element.service_name + "</td>";
      } else {
        grid += "<td> Edita para agregar el servicio </td>";
      }

      if (element.service_description !== null) {
        grid += "<td>" + element.service_description + "</td>";
      } else {
        grid += "<td> Edita para agregar la descripción </td>";
      }

      if (element.service_price !== null) {
        grid += "<td>" + element.service_price + "</td>";
      } else {
        grid += "<td> Edita para agregar precio </td>";
      }
      grid += "<td> " + created_at + "</td>";
      grid +=
        "<td> <a href= service/" +
        element.service_id +
        "/" +
        element.reservation_id +
        "/" +
        element.account_id +
        ">Editar</a></td>";
      grid +=
        "<td> <a href= service/delete/" +
        element.service_id +
        "/" +
        element.reservation_id +
        "/" +
        element.account_id +
        ">Eliminar</a></td>";
      grid += "</tr>";
    });
    grid += "</tbody>";
    grid += "</table>";
  } else {
    grid += '<p class="notice"> No hay servicios disponibles </P>';
  }

  divReserv.innerHTML = grid;
}
getData();
