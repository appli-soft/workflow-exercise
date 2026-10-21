
const Decimal = require('decimal.js');

/**
 * Convert a monetary amount to integer cents using half-up rounding.
 * Decimal arithmetic avoids common JavaScript floating-point errors.
 *
 * Example: 1.005 becomes 101 cents ($1.01).
 */
function toCents(amount) {
  return new Decimal(amount)
    .mul(100)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();
}

/**
 * Reconcile invoice line items against the stated subtotal and total.
 *
 * Each line item is rounded to cents before the subtotal is calculated.
 * Tax is then calculated from the rounded subtotal.
 *
 * @param {Object} payload
 * @param {Array} payload.lineItems
 * @param {number} payload.statedSubtotal
 * @param {number} payload.taxRate - Example: 0.18 means 18%.
 * @param {number} payload.statedTotal
 * @returns {Object} Reconciliation results and calculated line items.
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

  // A difference of up to two cents is acceptable.
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

    // Multiply using Decimal before rounding the result to cents.
    const exactLineAmount = new Decimal(item.qty).mul(item.unitPrice);
    const lineTotalCents = toCents(exactLineAmount);

    subtotalCents += lineTotalCents;

    return {
      ...item,
      lineTotal: lineTotalCents / 100
    };
  });

  // Subtotal is already in cents, so round the taxed result to whole cents.
  const calculatedTotalCents = new Decimal(subtotalCents)
    .mul(new Decimal(1).plus(taxRate))
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();

  const statedSubtotalCents = toCents(statedSubtotal);
  const statedTotalCents = toCents(statedTotal);

  // Positive discrepancy means the calculated amount is higher.
  const subtotalDiffCents = subtotalCents - statedSubtotalCents;
  const totalDiffCents = calculatedTotalCents - statedTotalCents;

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
