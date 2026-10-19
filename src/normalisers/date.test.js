
const { standardizeDate } = require("./date");

describe("standardizeDate", () => {
  test("converts YYYY-MM-DD dates", () => {
    expect(standardizeDate("2026-10-12")).toBe("2026-10-12");
  });

  test("converts dates with dots", () => {
    expect(standardizeDate("2026.10.12")).toBe("2026-10-12");
  });

  test("converts DD/MM/YYYY dates", () => {
    expect(standardizeDate("12/10/2026")).toBe("2026-10-12");
  });

  test("converts DD-MM-YYYY dates", () => {
    expect(standardizeDate("12-10-2026")).toBe("2026-10-12");
  });

  test("handles dates with month names", () => {
    expect(standardizeDate("Oct 12, 2026")).toBe("2026-10-12");
  });

  test("uses DD/MM/YYYY for ambiguous dates", () => {
    expect(standardizeDate("03/04/2026")).toBe("2026-04-03");
  });

  test("returns null for invalid dates", () => {
    expect(standardizeDate("2026-02-30")).toBeNull();
    expect(standardizeDate("hello")).toBeNull();
    expect(standardizeDate("")).toBeNull();
  });

  test("rejects dates older than five years", () => {
    expect(standardizeDate("2019-01-01")).toBeNull();
  });

  test("rejects dates more than 30 days ahead", () => {
    expect(standardizeDate("2026-12-01")).toBeNull();
  });

  test("returns null for non-string values", () => {
    expect(standardizeDate(null)).toBeNull();
    expect(standardizeDate(123)).toBeNull();
  });
});
