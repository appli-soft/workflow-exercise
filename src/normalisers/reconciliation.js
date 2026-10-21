
/**
 * Convert a monetary amount to integer cents.
 *
 * Adding Number.EPSILON helps correct some floating-point
 * representation errors before rounding to the nearest cent.
 *
 * @param {number} amount
 * @returns {number}
 */
function toCents(amount) {
  return Math.round((amount + Number.EPSILON) * 100);
}

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

  // Allow a discrepancy of up to two cents.
  const TOLERANCE_CENTS = 2;

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

    // Round each line item to the nearest cent before summing.
    const lineTotalCents = toCents(item.qty * item.unitPrice);

    subtotalCents += lineTotalCents;

    return {
      ...item,
      lineTotal: lineTotalCents / 100
    };
  });

  // Calculate tax from the subtotal expressed in currency units.
  const calculatedTotalCents = toCents(
    (subtotalCents / 100) * (1 + taxRate)
  );

  const statedSubtotalCents = toCents(statedSubtotal);
  const statedTotalCents = toCents(statedTotal);

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
