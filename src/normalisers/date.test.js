const { standardizeDate } = require("./date");

// Test different date formats and invalid dates.
test.each([
  ["2026-10-12", "2026-10-12"], // Standard format
  ["2026.10.12", "2026-10-12"], // Dot separator
  ["12/10/2026", "2026-10-12"], // DD/MM/YYYY format
  ["12-10-2026", "2026-10-12"], // Dash separator
  ["Oct 12, 2026", "2026-10-12"], // Month name format
  ["03/04/2026", "2026-04-03"], // Numeric dates are assumed to use DD/MM/YYYY format.
  ["2026-02-30", null], //Invalid calendar date
  ["not a date", null], // Invalid text
  ["01/01/1900", null], // Date too old
  
  // Mixed separators should be rejected.
  ["2026-10.12", null],
  ["12/10-2026", null],

  // Leap year tests
  ["29/02/2024", "2024-02-29"], // Valid leap day
  ["29/02/2023", null], // Invalid leap day
])("%s => %s", (input, expected) => {
  expect(standardizeDate(input)).toBe(expected);
});
