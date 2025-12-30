const inputNotAvailable = document.getElementById("not_available");
const div = document.getElementById("radioElement");

inputNotAvailable.addEventListener("change", async () => {
  div.innerHTML = "";
  console.log(inputNotAvailable.value);
  const selectDate = inputNotAvailable.value;
  const dates = await getAvailableDates();
  createCheckboxElements(dates, selectDate);
});

async function getAvailableDates() {
  const res = await fetch("/appointment/avaiable-dates");
  const data = await res.json();
  return data.dates;
}

function createCheckboxElements(dates, select) {
  const selectedDay = new Date(select);

  dates.forEach((element) => {
    const d = new Date(element);

    if (
      d.getFullYear() === selectedDay.getFullYear() &&
      d.getMonth() === selectedDay.getMonth() &&
      d.getDate() === selectedDay.getDate() + 1
    ) {
      const id = `slot-${d.getTime()}`;

      const label = document.createElement("label");
      label.className = "slot";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = id;

      input.name = "not_available_times[]";

      input.value = d.toISOString();

      const text = document.createElement("span");
      text.textContent = d.toLocaleString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      label.htmlFor = id;
      label.appendChild(input);
      label.appendChild(text);
      div.appendChild(label);
    }
  });
}
