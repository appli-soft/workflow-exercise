/**
 * Task 1: Ashish
 * Clean raw string/number monetary values into a 2-decimal float for MariaDB DECIMAL(12,2).
 * @param {string|number} rawValue
 * @returns {number|null}
 */
function sanitizeAmount(rawValue) {
  // TODO: Implement amount parsing and rounding
 if (
    rawValue === null ||
    rawValue === undefined ||
    (typeof rawValue !== "string" && typeof rawValue !== "number")
  ) {
    return null;
  }

  if (typeof rawValue === "number" && !Number.isFinite(rawValue)) {
    return null;
  }

  let value = String(rawValue).trim();

  if (value === "") {
    return null;
  }

 
  const suffixMatch = value.match(/\s*(CR|DR)\s*$/i);
  const suffix = suffixMatch ? suffixMatch[1].toUpperCase() : null;

  if (suffixMatch) {
    value = value.slice(0, suffixMatch.index).trim();
  }

  
  value = value.replace(/[₹$€£\s]/g, "");

  
  if (!/^-?\d[\d.,]*$/.test(value)) {
    return null;
  }

  const negative = value.startsWith("-");
  let numericPart = negative ? value.slice(1) : value;

  if (!/\d/.test(numericPart)) {
    return null;
  }

  const lastComma = numericPart.lastIndexOf(",");
  const lastDot = numericPart.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    
    const decimalSeparator =
      lastComma > lastDot ? "," : ".";

    const thousandsSeparator =
      decimalSeparator === "," ? "." : ",";

    const decimalIndex = numericPart.lastIndexOf(decimalSeparator);
    const integerPart = numericPart.slice(0, decimalIndex);
    const decimalPart = numericPart.slice(decimalIndex + 1);

    const escapedThousands =
      thousandsSeparator === "," ? "," : "\\.";

    const groupingPattern = new RegExp(
      `^(?:\\d+|\\d{1,3}(?:${escapedThousands}\\d{3})+)$`
    );

    if (!groupingPattern.test(integerPart) || !/^\d+$/.test(decimalPart)) {
      return null;
    }

    numericPart =
      integerPart.replace(/[.,]/g, "") + "." + decimalPart;
  } else if (lastComma !== -1) {
    const parts = numericPart.split(",");

    if (parts.length > 2) {
      if (!/^\d{1,3}(?:,\d{3})+$/.test(numericPart)) {
        return null;
      }
      numericPart = numericPart.replace(/,/g, "");
    } else {
      const [integerPart, decimalPart] = parts;

      if (!integerPart || !decimalPart) {
        return null;
      }

     
      if (decimalPart.length === 3) {
        numericPart = integerPart + decimalPart;
      } else {
        numericPart = integerPart + "." + decimalPart;
      }
    }
  } else if (lastDot !== -1) {
    const parts = numericPart.split(".");

    if (parts.length > 2) {
      return null;
    }

    if (!parts[0] || !parts[1]) {
      return null;
    }
    numericPart = parts[0] + "." + parts[1];
  }

  let amount = Number(numericPart);

  if (!Number.isFinite(amount)) {
    return null;
  }

  if (negative || suffix === "DR") {
    amount = -Math.abs(amount);
  } else if (suffix === "CR") {
    amount = Math.abs(amount);
  }

  const roundedAmount =
    Math.round((amount + Math.sign(amount) * Number.EPSILON) * 100) / 100;

  if (
    !Number.isFinite(roundedAmount) ||
    Math.abs(roundedAmount) >= 10000000000
  ) {
    return null;
  }

  return Object.is(roundedAmount, -0) ? 0 : roundedAmount;
}

module.exports = { sanitizeAmount };