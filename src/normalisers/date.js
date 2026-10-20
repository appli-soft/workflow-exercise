function standardizeDate(rawDateString) {
  if (typeof rawDateString !== "string"){
    return null
  };

  const input = rawDateString.trim();
  let year, month, day, match;

  match = input.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})$/);

  if (match) {
    [, year, month, day] = match;
  } else if ((match = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/))) {
    
    [, day, month, year] = match;
  } else if ((match = input.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/))) {
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
    month = months.indexOf(match[1].slice(0, 3).toLowerCase()) + 1;
    [, , day, year] = match;
  } else {
    return null;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);

  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year < 1000 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  const min = new Date(
    Date.UTC(today.getFullYear() - 5, today.getMonth(), today.getDate()),
  );
  const max = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 30),
  );

  if (date < min || date > max) {
    return null
  };

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

module.exports = { standardizeDate };
