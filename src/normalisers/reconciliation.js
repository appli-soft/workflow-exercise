/**
 * Task 3: Nahid
 * Calculate totals and verify whether line items balance against invoice header totals.
 * @param {Object} payload - { lineItems: Array<{description, qty, unitPrice}>, statedSubtotal, taxRate, statedTotal }
 * @returns {Object} - { isReconciled: boolean, calculatedSubtotal: number, calculatedTotal: number, discrepancy: number }
 */
function reconcileInvoiceTotals(payload) {
  // TODO: Implement floating-point-safe line item calculation and reconciliation
  throw new Error('Not implemented');
}

module.exports = { reconcileInvoiceTotals };