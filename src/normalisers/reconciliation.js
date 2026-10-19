/**
 * Task 3: Nahid
 * Calculate totals and verify whether line items balance against invoice header totals.
 * @param {Object} payload - { lineItems: Array<{description, qty, unitPrice}>, statedSubtotal, taxRate, statedTotal }
 * @returns {Object} - { isReconciled: boolean, calculatedSubtotal: number, calculatedTotal: number, discrepancy: number }
 */

function reconcileInvoiceTotals(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('Payload must be an object');
  }

  const { lineItems, statedSubtotal, taxRate, statedTotal } = payload;

  if (!Array.isArray(lineItems)) {
    throw new TypeError('lineItems must be an array');
  }

  if (
    !Number.isFinite(statedSubtotal) ||
    !Number.isFinite(statedTotal) ||
    !Number.isFinite(taxRate) ||
    statedSubtotal < 0 ||
    statedTotal < 0 ||
    taxRate < 0
  ) {
    throw new TypeError('Invalid invoice values');
  }

  const subtotalCents = lineItems.reduce((sum, item) => {
    if (
      !item ||
      !Number.isFinite(item.qty) ||
      !Number.isFinite(item.unitPrice) ||
      item.qty < 0 ||
      item.unitPrice < 0
    ) {
      throw new TypeError('Invalid line item');
    }

    const priceCents = Math.round(item.unitPrice * 100);
    return sum + Math.round(item.qty * priceCents);
  }, 0);

  const totalCents = Math.round(subtotalCents * (1 + taxRate));
  const statedSubtotalCents = Math.round(statedSubtotal * 100);
  const statedTotalCents = Math.round(statedTotal * 100);

  return {
    isReconciled:
      subtotalCents === statedSubtotalCents &&
      totalCents === statedTotalCents,
    calculatedSubtotal: subtotalCents / 100,
    calculatedTotal: totalCents / 100,
    discrepancy: (totalCents - statedTotalCents) / 100
  };
}

module.exports = { reconcileInvoiceTotals };
