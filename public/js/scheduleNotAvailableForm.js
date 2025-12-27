const inputNotAvailable = document.getElementById("not-available");
const div = document.getElementById("radioElement");

inputNotAvailable.addEventListener("change", async () => {
  console.log(inputNotAvailable.value);
  const selectDate = inputNotAvailable.value;
  const dates = await getAvailableDates();
  crateRadioElement(dates, selectDate);
});

async function getAvailableDates() {
  const res = await fetch("/appointment/avaiable-dates");
  const data = await res.json();
  return data.dates;
}

function crateRadioElement(dates, select) {
  const s = new Date(select);
  dates.forEach((element) => {
    const e = new Date(element);
    if (
      e.getFullYear() === s.getFullYear() &&
      e.getMonth() === s.getMonth() &&
      e.getDay() === s.getDay()
    ) {
      const r = document.createElement("input");
      const l = document.createElement("label");
      l.setAttribute("for", "avilable");
      const s = e.toLocaleString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      r.setAttribute("type", "radio");
      r.setAttribute("id", "available");
      l.textContent = s;
      div.appendChild(l);
      div.appendChild(r);
    }
  });
}


