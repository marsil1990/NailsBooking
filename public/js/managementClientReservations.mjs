import { renderReservations } from "./renderReservations.mjs";
import { filterBydate } from "./filters.mjs";

const filterDate = document.querySelector(".filterBydate");

async function getDataReservation() {
  const res = await fetch("/appointment/myOwnAppointment");
  const data = await res.json();
  console.log(data.dates);
  renderReservations(data.dates);
  if (filterDate) {
    filterDate.addEventListener("input", async () => {
      const result = await filterBydate(data, filterDate.value);
      if (filterDate.value === "") {
        renderReservations(data.dates);
      } else renderReservations(result);
    });
  }
}

getDataReservation();
