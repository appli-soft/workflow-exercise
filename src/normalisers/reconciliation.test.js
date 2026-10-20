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

  expect(result.isReconciled).toBe(true);
  expect(result.calculatedSubtotal).toBe(250);
  expect(result.calculatedTotal).toBe(295);
  expect(result.discrepancy).toBe(0);

  expect(result.lineItems).toEqual([
    {
      description: 'Product A',
      qty: 2,
      unitPrice: 100,
      lineTotal: 200
    },
    {
      description: 'Product B',
      qty: 1,
      unitPrice: 50,
      lineTotal: 50
    }
  ]);
});

test('accepts a penny-rounding discrepancy within tolerance', () => {
  const result = reconcileInvoiceTotals({
    lineItems: [
      { description: 'Item A', qty: 1, unitPrice: 40 },
      { description: 'Item B', qty: 1, unitPrice: 60 }
    ],
    statedSubtotal: 100.01,
    taxRate: 0.18,
    statedTotal: 118.01
  });

  expect(result.isReconciled).toBe(true);
  expect(result.calculatedSubtotal).toBe(100);
  expect(result.calculatedTotal).toBe(118);
  expect(result.discrepancy).toBe(-0.01);
  expect(result.subtotalDiscrepancy).toBe(-0.01);
});

test('rejects an outright mismatched invoice', () => {
  const result = reconcileInvoiceTotals({
    lineItems: [
      { description: 'Item A', qty: 2, unitPrice: 50 }
    ],
    statedSubtotal: 200,
    taxRate: 0.18,
    statedTotal: 236
  });

  expect(result.isReconciled).toBe(false);
  expect(result.calculatedSubtotal).toBe(100);
  expect(result.calculatedTotal).toBe(118);
  expect(result.discrepancy).toBe(-118);
  expect(result.subtotalDiscrepancy).toBe(-100);
});
