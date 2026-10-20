
/**
 * Task 4: Shubham
 * Sanitize vendor name and validate tax identifier patterns (e.g., GSTIN, EIN).
 * @param {Object} payload - { rawName: string, rawTaxId: string }
 * @returns {Object} - { cleanName: string, taxId: string, isValid: boolean, formatDetected: string }
 */
function cleanVendorPayload(payload) {
  // Handle missing or invalid input.
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    payload = {};
  }

  const rawName =
    typeof payload.rawName === 'string' ? payload.rawName : '';

  let cleanName = rawName
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  cleanName = cleanName
    .replace(
      /,?\s+(LLC|L\.L\.C\.|PVT\.?\s*LTD\.?|PRIVATE LIMITED|INC\.?|INCORPORATED|LTD\.?|LIMITED)\.?$/i,
      ''
    )
    .trim();

  cleanName = cleanName
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());

  const rawTaxId =
    typeof payload.rawTaxId === 'string' ? payload.rawTaxId : '';

  const taxId = rawTaxId
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[\s:.-]/g, '')
    .toUpperCase();

  let isValid = false;
  let formatDetected = 'UNKNOWN';

  const gstinPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const einPattern = /^[0-9]{9}$/;
  const vatPattern = /^[A-Z]{2}[A-Z0-9]{8,12}$/;

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

  return {
    cleanName,
    taxId,
    isValid,
    formatDetected
  };
}

module.exports = { cleanVendorPayload };