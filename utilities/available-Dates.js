const reservationModel = require("../models/reservation-model");

async function availableDatesForBook() {
  const dates = await reservationModel.getReservationsDates();

  const vacation = await reservationModel.getAllVacations();
  const disablehours = await reservationModel.getAlldisablehours();
  const setDisablehours = new Set();
  disablehours.forEach((element) => {
    setDisablehours.add(element.time_disabled.getTime());
  });

  const availableDates = [];

  let date = new Date();
  console.log(date);
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);

  let twoMonth = new Date();
  twoMonth.setMonth(twoMonth.getMonth() + 2);

  const RANGE = 2 * 60 * 60 * 1000;
  let avaiable;
  while (date.getTime() < twoMonth.getTime()) {
    const exists = dates.some((d) => {
      const appDate = new Date(d.appointment_datetime);
      const getapptime = appDate.getTime() + 3 * 60 * 60 * 1000;
      return (
        getapptime > date.getTime() - RANGE &&
        getapptime < date.getTime() + RANGE
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

      if (avaiable && !setDisablehours.has(date.getTime())) {
        availableDates.push(new Date(date));
      }
    }

    date.setMinutes(date.getMinutes() + 30);
  }

  return availableDates;
}

async function availableDatesForEdit(uruDate) {
  const dates = await reservationModel.getReservationsDatesCurrentDate(uruDate);
  console.log(dates);
  const vacation = await reservationModel.getAllVacations();
  const disablehours = await reservationModel.getAlldisablehours();
  const setDisablehours = new Set();
  disablehours.forEach((element) => {
    setDisablehours.add(element.time_disabled.getTime());
  });

  const availableDates = [];

  let date = new Date();
  console.log(date);
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);

  let twoMonth = new Date();
  twoMonth.setMonth(twoMonth.getMonth() + 2);

  const RANGE = 2 * 60 * 60 * 1000;
  let avaiable;
  while (date.getTime() < twoMonth.getTime()) {
    const exists = dates.some((d) => {
      const appDate = new Date(d.appointment_datetime);
      const getapptime = appDate.getTime() + 3 * 60 * 60 * 1000;
      return (
        getapptime > date.getTime() - RANGE && //x-2<10<x+2           8<x  10    x<12
        getapptime < date.getTime() + RANGE
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

      if (avaiable && !setDisablehours.has(date.getTime())) {
        availableDates.push(new Date(date));
      }
    }

    date.setMinutes(date.getMinutes() + 30);
  }

  return availableDates;
}

module.exports = {
  availableDatesForBook,
  availableDatesForEdit,
};
