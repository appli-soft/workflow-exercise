function sanitizeAmount(rawValue) {

  // Check input type and null value
  if (
    rawValue === null ||
    rawValue === undefined ||
    (typeof rawValue !== "string" && typeof rawValue !== "number")
  ) {
    return null;
  }

  // Check valid number
  if (typeof rawValue === "number" && !Number.isFinite(rawValue)) {
    return null;
  }

  // Convert input to string and remove extra spaces
  let value = String(rawValue).trim();

  // Check empty input
  if (value === "") {
    return null;
  }

  // Extract CR or DR suffix
  const suffixMatch = value.match(/\s*(CR|DR)\s*$/i);
  const suffix = suffixMatch ? suffixMatch[1].toUpperCase() : null;

  // Remove CR or DR from input
  if (suffixMatch) {
    value = value.slice(0, suffixMatch.index).trim();
  }

  // Remove currency symbols and spaces
  value = value.replace(/[₹$€£\s]/g, "");

  // Validate numeric format
  if (!/^-?\d[\d.,]*$/.test(value)) {
    return null;
  }

  // Check negative sign
  const negative = value.startsWith("-");
  let numericPart = negative ? value.slice(1) : value;

  // Check at least one digit
  if (!/\d/.test(numericPart)) {
    return null;
  }

  // Find last comma and dot positions
  const lastComma = numericPart.lastIndexOf(",");
  const lastDot = numericPart.lastIndexOf(".");

  // Handle both comma and dot
  if (lastComma !== -1 && lastDot !== -1) {

    // Identify decimal separator
    const decimalSeparator =
      lastComma > lastDot ? "," : ".";

    // Identify thousands separator
    const thousandsSeparator =
      decimalSeparator === "," ? "." : ",";

    // Extract integer and decimal parts
    const decimalIndex = numericPart.lastIndexOf(decimalSeparator);
    const integerPart = numericPart.slice(0, decimalIndex);
    const decimalPart = numericPart.slice(decimalIndex + 1);

    // Escape thousands separator for Regex
    const escapedThousands =
      thousandsSeparator === "," ? "," : "\\.";

    // Validate thousands grouping format
    const groupingPattern = new RegExp(
      `^(?:\\d+|\\d{1,3}(?:${escapedThousands}\\d{3})+)$`
    );

    // Validate integer and decimal parts
    if (!groupingPattern.test(integerPart) || !/^\d+$/.test(decimalPart)) {
      return null;
    }

    // Remove thousands separator and normalize decimal separator
    numericPart =
      integerPart.replace(/[.,]/g, "") + "." + decimalPart;

  // Handle comma-only numbers
  } else if (lastComma !== -1) {

    // Split number by comma
    const parts = numericPart.split(",");

    // Validate multiple comma grouping
    if (parts.length > 2) {
      if (!/^\d{1,3}(?:,\d{3})+$/.test(numericPart)) {
        return null;
      }

      // Remove thousands commas
      numericPart = numericPart.replace(/,/g, "");

    } else {
      // Extract integer and decimal parts
      const [integerPart, decimalPart] = parts;

      // Check both parts are present
      if (!integerPart || !decimalPart) {
        return null;
      }

      // Handle comma as thousands or decimal separator
      if (decimalPart.length === 3) {
        numericPart = integerPart + decimalPart;
      } else {
        numericPart = integerPart + "." + decimalPart;
      }
    }

  // Handle dot-only numbers
  } else if (lastDot !== -1) {

    // Split number by dot
    const parts = numericPart.split(".");

    // Reject multiple dots
    if (parts.length > 2) {
      return null;
    }

    // Check integer and decimal parts
    if (!parts[0] || !parts[1]) {
      return null;
    }

    // Normalize decimal separator
    numericPart = parts[0] + "." + parts[1];
  }

  // Convert string to number
  let amount = Number(numericPart);

  // Validate converted amount
  if (!Number.isFinite(amount)) {
    return null;
  }

  // Apply negative or positive sign
  if (negative || suffix === "DR") {
    amount = -Math.abs(amount);
  } else if (suffix === "CR") {
    amount = Math.abs(amount);
  }

  // Round amount to 2 decimal places
  const roundedAmount =
    Math.round((amount + Math.sign(amount) * Number.EPSILON) * 100) / 100;

  // Validate MariaDB DECIMAL(12,2) range
  if (
    !Number.isFinite(roundedAmount) ||
    Math.abs(roundedAmount) >= 10000000000
  ) {
    return null;
  }

  // Convert negative zero to positive zero
  return Object.is(roundedAmount, -0) ? 0 : roundedAmount;
}

// Export the function
module.exports = { sanitizeAmount };