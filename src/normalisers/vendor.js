/**
 * Task 4: Shubham
 * Sanitize vendor name and validate tax identifier patterns (e.g., GSTIN, EIN).
 * @param {Object} payload - { rawName: string, rawTaxId: string }
 * @returns {Object} - { cleanName: string, taxId: string, isValid: boolean, formatDetected: string }
 */
function cleanVendorPayload(payload) {
  // TODO: Implement name normalization and Tax ID regex validation
  throw new Error('Not implemented');
}

module.exports = { cleanVendorPayload };