
function standardizeDate(rawDateString) {
  // Step 1: Check whether the input is a string.
  // If the input is not a string, return null.
  if (typeof rawDateString !== "string"){
    return null
  };

  // Step 2: Remove extra spaces from the beginning and end of the input.
  const input = rawDateString.trim();

  // Step 3: Declare variables to store year, month, day and regex match result.
  let year, month, day, match;

  // Step 4: Match dates in YYYY-MM-DD or YYYY.MM.DD format.
  // \d{4} matches exactly 4 digits (year).
  // [-.] allows either a hyphen or a dot as separator.
  // \d{1,2} matches 1 or 2 digits (month and day).
  // \2 ensures that the second separator is the same as the first.
  match = input.match(/^(\d{4})([-.])(\d{1,2})\2(\d{1,2})$/);

  // Step 5: If the first date format matches, extract year, month and day.
  if (match) {
    [, year, ,month, day] = match;

  // Step 6: If the first format does not match, check DD/MM/YYYY or DD-MM-YYYY.
  // Numeric dates are assumed to follow DD/MM/YYYY format.
  // \2 ensures that both separators are the same.
  } else if ((
    match = input.match(/^(\d{1,2})([/-])(\d{1,2})\2(\d{4})$/)
  )){
    
    // Extract day, month and year from the matched result.
    [, day, ,month, year] = match;

  // Step 7: If numeric formats do not match, check month-name format.
  // Example: Oct 12, 2026.
  // [A-Za-z]+ matches alphabetic characters.
  // \s+ matches one or more spaces.
  // ,? means comma is optional.
  } else if ((
    match = input.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  )) {

    // Store the first three letters of all 12 months.
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

    // Convert the month name into its numeric value.
    // slice(0, 3) takes the first three letters.
    // toLowerCase() converts them into lowercase.
    // indexOf() finds the month position.
    // +1 converts the zero-based index into the actual month number.
    month = months.indexOf(match[1].slice(0, 3).toLowerCase()) + 1;

    // Extract day and year from the matched result.
    [, , day, year] = match;

  } else {
    // Step 8: If none of the supported formats match, return null.
    return null;
  }

  // Step 9: Convert year, month and day from strings into numbers.
  year = Number(year);
  month = Number(month);
  day = Number(day);

  // Step 10: Create a JavaScript Date object using timestamp 0 (Unix epoch).
  const date = new Date(0);

  // Set the time to midnight in UTC to avoid timezone-related time differences.
  date.setUTCHours(0, 0, 0, 0);

  // Set the extracted year, month and day in the Date object.
  // JavaScript months start from 0, so subtract 1 from the month.
  date.setUTCFullYear(year, month - 1, day);

  // Step 11: Validate the actual calendar date.
  if (
    // Reject years earlier than 1000.
    year < 1000 ||

    // Check whether the generated year matches the input year.
    date.getUTCFullYear() !== year ||

    // Check whether the generated month matches the input month.
    date.getUTCMonth() !== month - 1 ||

    // Check whether the generated day matches the input day.
    // This also rejects invalid dates such as 29 February in a non-leap year.
    date.getUTCDate() !== day
  ) {
    // Return null if the date is invalid.
    return null;
  }

  // Step 12: Define the allowed invoice date range.
  // Dates can be from the last 5 years to the next 30 days.
  const today = new Date();

  // Calculate the minimum allowed date (5 years before today).
  const min = new Date(
    Date.UTC(today.getFullYear() - 5, today.getMonth(), today.getDate()),
  );

  // Calculate the maximum allowed date (30 days after today).
  const max = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 30),
  );

  // Step 13: Reject dates outside the allowed business date range.
  if (date < min || date > max) {
    return null
  };

  // Step 14: Convert the valid date into YYYY-MM-DD format.
  // padStart(2, "0") adds a leading zero if month or day has only one digit.
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Step 15: Export the function so it can be imported and used in other files.
module.exports = { standardizeDate };
