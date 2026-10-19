
/**
 * Task 2: Mithlesh 
 * Normalize varied input dates to strict MySQL/MariaDB DATE format (YYYY-MM-DD).
 */

function standardizeDate(rawDate) {
  if (typeof rawDate !== "string" || !rawDate.trim()) {
    return null;
  }

  rawDate = rawDate.trim();

  let year, month, day;
  let parts;

  if (/^\d{4}[-.]\d{1,2}[-.]\d{1,2}$/.test(rawDate)) {
    parts = rawDate.split(/[-.]/);
    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(rawDate)) {
    parts = rawDate.split(/[/-]/);
    day = Number(parts[0]);
    month = Number(parts[1]);
    year = Number(parts[2]);
  } else {
    parts = rawDate.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);

    if (!parts) return null;

    const months = [
      "january", "february", "march", "april",
      "may", "june", "july", "august",
      "september", "october", "november", "december"
    ];

    const name = parts[1].toLowerCase();
    month = months.indexOf(name) + 1;

    if (month === 0 && name.length >= 3) {
      month = months.findIndex(m => m.startsWith(name)) + 1;
    }

    if (month === 0) return null;

    day = Number(parts[2]);
    year = Number(parts[3]);
  }

  if (year < 1000 || year > 9999 || month < 1 || month > 12) {
    return null;
  }

  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const now = new Date();
  const today = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ));

  const minDate = new Date(today);
  minDate.setUTCFullYear(minDate.getUTCFullYear() - 5);

  const maxDate = new Date(today);
  maxDate.setUTCDate(maxDate.getUTCDate() + 30);

  if (date < minDate || date > maxDate) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

module.exports = { standardizeDate };
