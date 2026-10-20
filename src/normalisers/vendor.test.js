
const { cleanVendorPayload } = require('./vendor');

describe('cleanVendorPayload', () => {
  test('cleans vendor name and removes legal suffix', () => {
    const result = cleanVendorPayload({
      rawName: '  ACME   CORPORATION LLC  ',
      rawTaxId: '12-3456789'
    });

    expect(result.cleanName).toBe('Acme Corporation');
    expect(result.taxId).toBe('123456789');
    expect(result.isValid).toBe(true);
    expect(result.formatDetected).toBe('EIN');
  });

  test('normalizes GSTIN and removes OCR punctuation', () => {
    const result = cleanVendorPayload({
      rawName: '  blue   sky pvt ltd ',
      rawTaxId: '27:ABCDE1234F:1:Z5'
    });

    expect(result.cleanName).toBe('Blue Sky');
    expect(result.taxId).toBe('27ABCDE1234F1Z5');
    expect(result.isValid).toBe(true);
    expect(result.formatDetected).toBe('GSTIN');
  });

  test('rejects an invalid tax ID', () => {
    const result = cleanVendorPayload({
      rawName: 'Example Inc.',
      rawTaxId: 'INVALID-ID'
    });

    expect(result.cleanName).toBe('Example');
    expect(result.taxId).toBe('INVALIDID');
    expect(result.isValid).toBe(false);
    expect(result.formatDetected).toBe('UNKNOWN');
  });

  test('handles missing and malformed input safely', () => {
    expect(cleanVendorPayload(null)).toEqual({
      cleanName: '',
      taxId: '',
      isValid: false,
      formatDetected: 'UNKNOWN'
    });

    expect(cleanVendorPayload({
      rawName: 123,
      rawTaxId: null
    })).toEqual({
      cleanName: '',
      taxId: '',
      isValid: false,
      formatDetected: 'UNKNOWN'
    });
  });
});
