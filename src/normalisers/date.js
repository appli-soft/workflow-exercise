function standardizeDate(rawDateString) {
  if (typeof rawDateString !== "string"){
    return null
  };

  const input = rawDateString.trim();
  let year, month, day, match;

  // Match YYYY-MM-DD or YYYY.MM.DD.
  // \2 makes sure the second separator is the same as the first.
  match = input.match(/^(\d{4})([-.])(\d{1,2})\2(\d{1,2})$/);

  if (match) {
    [, year, ,month, day] = match;
  } else if ((
    // Match DD/MM/YYYY or DD-MM-YYYY.
    // Assume dates are in DD/MM/YYYY format.
    // \2 ensures both separators are the same.
    match = input.match(/^(\d{1,2})([/-])(\d{1,2})\2(\d{4})$/)
  )){
    
    [, day, ,month, year] = match;
  } else if ((
    // Match dates like "Oct 12, 2026".
    match = input.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  )) {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    // Convert the month name to a number
    month = months.indexOf(match[1].slice(0, 3).toLowerCase()) + 1;
    [, , day, year] = match;
  } else {
    // Return null if the format is not valid.
    return null;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);

  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  // Reject invalid dates, including invalid leap days.
  if (
    year < 1000 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  // Allow dates from the last 5 years to the next 30 days.
  const today = new Date();
  const min = new Date(
    Date.UTC(today.getFullYear() - 5, today.getMonth(), today.getDate()),
  );
  const max = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 30),
  );

  // Return null if the date is outside the allowed range.
  if (date < min || date > max) {
    return null
  };

  // Return the date in YYYY-MM-DD format.
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

module.exports = { standardizeDate };
