
const { standardizeDate } = require("./date");

test.each([
  ["2026-10-12", "2026-10-12"],
  ["2026.10.12", "2026-10-12"],
  ["12/10/2026", "2026-10-12"],
  ["12-10-2026", "2026-10-12"],
  ["Oct 12, 2026", "2026-10-12"],
  ["03/04/2026", "2026-04-03"],
  ["2026-02-30", null],
  ["not a date", null],
  ["01/01/1900", null],
  ["Oct 12, 2099", null]
])("%s => %s", (input, expected) => {
  expect(standardizeDate(input)).toBe(expected);
});
