
const { reconcileInvoiceTotals } = require('./reconciliation');

test('calculates invoice totals correctly', () => {
  const result = reconcileInvoiceTotals({
    lineItems: [
      { description: 'Product A', qty: 2, unitPrice: 100 },
      { description: 'Product B', qty: 1, unitPrice: 50 }
    ],
    statedSubtotal: 250,
    taxRate: 0.18,
    statedTotal: 295
  });

  expect(result).toEqual({
    isReconciled: true,
    calculatedSubtotal: 250,
    calculatedTotal: 295,
    discrepancy: 0
  });
});
