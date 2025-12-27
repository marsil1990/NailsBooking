const reservationModel = require("../models/reservation-model");

async function availableDatesForBook() {
  const dates = await reservationModel.getReservationsDates();
  const vacation = await reservationModel.getAllVacations();
  const availableDates = [];

  let date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);

  let twoMonth = new Date();
  twoMonth.setMonth(twoMonth.getMonth() + 2);

  const RANGE = 2 * 60 * 60 * 1000;
  let avaiable;
  while (date.getTime() < twoMonth.getTime()) {
    const exists = dates.some((d) => {
      const apptTime = new Date(d.appointment_datatime).getTime();
      return (
        apptTime > date.getTime() - RANGE && apptTime < date.getTime() + RANGE
      );
    });

    avaiable = true;
    if (
      !exists &&
      date.getHours() >= 8 &&
      date.getHours() < 21 &&
      date.getDay() !== 0
    ) {
      for (const element of vacation) {
        if (
          element.datestart.getTime() <= date.getTime() &&
          element.dateend.getTime() >= date.getTime()
        ) {
          avaiable = false;
          break;
        }
      }
      if (avaiable) availableDates.push(new Date(date.getTime()));
    }

    date.setMinutes(date.getMinutes() + 30);
  }

  return availableDates;
}

module.exports = {
  availableDatesForBook,
};
