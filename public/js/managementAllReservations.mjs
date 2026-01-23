import { renderReservations } from "./renderReservations.mjs";
import { filterByemail, filterBydate } from "./filters.mjs";

const filterEmail = document.getElementById("filterByemail");
const filterDate = document.querySelector(".filterBydate");

async function getData() {
  const res = await fetch("/appointment/reservations");
  const data = await res.json();
  renderReservations(data.dates);
  if (filterEmail) {
    filterEmail.addEventListener("input", async () => {
      const f = filterEmail.value.trim().toLowerCase();
      const result = await filterByemail(data, f);
      renderReservations(result);
    });
  }
  if (filterDate) {
    filterDate.addEventListener("input", async () => {
      const result = await filterBydate(data, filterDate.value);
      if (filterDate.value === "") {
        renderReservations(data.dates);
      } else renderReservations(result);
    });
  }
}

getData();
