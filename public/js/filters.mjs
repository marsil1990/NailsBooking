export async function filterByemail(data, filtering) {
  const result = data.dates.filter((e) =>
    e.account_email.toLowerCase().includes(filtering),
  );
  return result;
}

export async function filterBydate(data, filtering) {
  const fulldate = new Date(filtering);
  const result = data.dates.filter((e) => {
    const d = new Date(e.appointment_datetime);
    return (
      fulldate.getUTCFullYear() === d.getUTCFullYear() &&
      fulldate.getUTCMonth() === d.getUTCMonth() &&
      fulldate.getUTCDay() === d.getUTCDay()
    );
  });
  
  return result;
}
