
/**
 * Reconcile invoice line items against stated subtotal and total.
 *
 * @param {Object} payload
 * @param {Array<{description: string, qty: number, unitPrice: number}>} payload.lineItems
 * @param {number} payload.statedSubtotal
 * @param {number} payload.taxRate - e.g. 0.18 for 18%
 * @param {number} payload.statedTotal
 * @returns {Object}
 */
function reconcileInvoiceTotals(payload) {
  if (
    !payload ||
    typeof payload !== 'object' ||
    Array.isArray(payload)
  ) {
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

  // Tolerance: 2 cents (±0.02).
  const TOLERANCE_CENTS = 2;

  // Convert amounts to integer cents to avoid floating-point
  // errors such as 0.1 + 0.2 !== 0.3.
  let subtotalCents = 0;

  const processedItems = lineItems.map((item, index) => {
    if (
      !item ||
      !Number.isFinite(item.qty) ||
      !Number.isFinite(item.unitPrice) ||
      item.qty < 0 ||
      item.unitPrice < 0
    ) {
      throw new TypeError(`Invalid line item at index ${index}`);
    }

    const lineTotalCents = Math.round(
      item.qty * item.unitPrice * 100
    );

    subtotalCents += lineTotalCents;

    return {
      ...item,
      lineTotal: lineTotalCents / 100
    };
  });

  const calculatedTotalCents = Math.round(
    subtotalCents * (1 + taxRate)
  );

  const statedSubtotalCents = Math.round(statedSubtotal * 100);
  const statedTotalCents = Math.round(statedTotal * 100);

  const subtotalDiffCents =
    subtotalCents - statedSubtotalCents;

  const totalDiffCents =
    calculatedTotalCents - statedTotalCents;

  const isReconciled =
    Math.abs(subtotalDiffCents) <= TOLERANCE_CENTS &&
    Math.abs(totalDiffCents) <= TOLERANCE_CENTS;

  return {
    isReconciled,
    calculatedSubtotal: subtotalCents / 100,
    calculatedTotal: calculatedTotalCents / 100,
    discrepancy: totalDiffCents / 100,
    subtotalDiscrepancy: subtotalDiffCents / 100,
    lineItems: processedItems
  };
}

module.exports = { reconcileInvoiceTotals };
