const { sanitizeAmount } = require("./amount");

test("handles ordinary numeric and string amounts", () => {
  expect(sanitizeAmount(100)).toBe(100);
  expect(sanitizeAmount("250.567")).toBe(250.57);
});

test("handles currency symbols and thousands separators", () => {
  expect(sanitizeAmount("₹1,250.50")).toBe(1250.5);
  expect(sanitizeAmount("$2,500.75")).toBe(2500.75);
});

test("handles European number formatting", () => {
  expect(sanitizeAmount("1.250,50")).toBe(1250.5);
  expect(sanitizeAmount("2.500,75")).toBe(2500.75);
});

test("handles negative amounts", () => {
  expect(sanitizeAmount("-250.50")).toBe(-250.5);
});

test("handles CR and DR suffixes", () => {
  expect(sanitizeAmount("250.00 CR")).toBe(250);
  expect(sanitizeAmount("250.00 DR")).toBe(-250);
});

test("returns null for invalid and empty values", () => {
  expect(sanitizeAmount("abc")).toBe(null);
  expect(sanitizeAmount("")).toBe(null);
  expect(sanitizeAmount(null)).toBe(null);
  expect(sanitizeAmount("₹")).toBe(null);
});

test("rejects values outside DECIMAL(12,2) range", () => {
  expect(sanitizeAmount("10000000000")).toBe(null);
});

test("rejects invalid thousands separator grouping", () => {
  expect(sanitizeAmount("12,34.56")).toBe(null);
});