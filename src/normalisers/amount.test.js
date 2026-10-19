const { sanitizeAmount } = require("./amount");

test("converts string to amount", () => {
  expect(sanitizeAmount("100")).toBe(100);
});

test("rounds amount to two decimal places", () => {
  expect(sanitizeAmount("250.567")).toBe(250.57);
});

test("removes rupee symbol and commas", () => {
  expect(sanitizeAmount("₹1,250.50")).toBe(1250.5);
});

test("returns null for invalid text", () => {
  expect(sanitizeAmount("abc")).toBe(null);
});

test("returns null for empty string", () => {
  expect(sanitizeAmount("")).toBe(null);
});

test("returns null for null input", () => {
  expect(sanitizeAmount(null)).toBe(null);
});