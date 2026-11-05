/**
 * Task 4: Shubham
 * Clean vendor names and check tax IDs like GSTIN, EIN and VAT.
 * @param {Object} payload - Contains rawName and rawTaxId.
 * @returns {Object} - Returns the cleaned name, tax ID and validation result.
 */
function cleanVendorPayload(payload) {
  // Use an empty object if the input is missing or invalid.
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    payload = {};
  }

  const rawName =
    typeof payload.rawName === 'string' ? payload.rawName : '';

  // Replace control characters with spaces and remove extra spaces.
  let cleanName = rawName
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove common company endings like LLC, LTD and INC.
  cleanName = cleanName
    .replace(
      /,?\s+(LLC|L\.L\.C\.|PVT\.?\s*LTD\.?|PRIVATE LIMITED|INC\.?|INCORPORATED|LTD\.?|LIMITED)\.?$/i,
      ''
    )
    .trim();

  // Make the name lowercase first, then capitalize the first letter
  // of each word. This also supports accented letters like é.
  // Apostrophes are kept correctly, so McDonald's becomes Mcdonald's.
  cleanName = cleanName
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, separator, letter) =>
      separator + letter.toUpperCase()
    );

  const rawTaxId =
    typeof payload.rawTaxId === 'string' ? payload.rawTaxId : '';

  // Remove control characters, spaces and common separators.
  // Convert the tax ID to uppercase for checking.
  const taxId = rawTaxId
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[\s:.-]/g, '')
    .toUpperCase();

  let isValid = false;
  let formatDetected = 'UNKNOWN';

  // GSTIN: Checks the expected pattern of the Indian GST number.
  // It contains digits and letters in specific positions.
  const gstinPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  // EIN: Checks that the tax ID contains exactly 9 digits.
  const einPattern = /^[0-9]{9}$/;

  // VAT: Starts with 2 letters, followed by 8 to 12 letters or digits.
  // The second check makes sure the ID body contains at least one digit.
  // This prevents IDs made only of letters from being accepted.
  const vatPattern =
    /^[A-Z]{2}(?=[A-Z0-9]{8,12}$)(?=[A-Z0-9]*[0-9])[A-Z0-9]{8,12}$/;

  // Check the tax ID format and save the matching type.
  if (gstinPattern.test(taxId)) {
    isValid = true;
    formatDetected = 'GSTIN';
  } else if (einPattern.test(taxId)) {
    isValid = true;
    formatDetected = 'EIN';
  } else if (vatPattern.test(taxId)) {
    isValid = true;
    formatDetected = 'VAT';
  }

  // Return the cleaned data and validation result.
  return {
    cleanName,
    taxId,
    isValid,
    formatDetected
  };
}

module.exports = { cleanVendorPayload };