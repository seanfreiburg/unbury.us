/**
 * Unit tests for src/utils/validation.ts
 * These tests cover the actual source code for code coverage
 */
import { describe, test, expect } from 'vitest';
import {
  isNumeric,
  validateLoanField,
  parseCurrency,
  parsePercentage,
  formatCurrency,
  formatPercentage
} from '../../src/utils/validation';

describe('isNumeric', () => {
  describe('with numbers', () => {
    test('returns true for positive integers', () => {
      expect(isNumeric(42)).toBe(true);
      expect(isNumeric(0)).toBe(true);
    });

    test('returns true for negative numbers', () => {
      expect(isNumeric(-5)).toBe(true);
    });

    test('returns true for decimals', () => {
      expect(isNumeric(3.14)).toBe(true);
      expect(isNumeric(0.001)).toBe(true);
    });

    test('returns false for NaN', () => {
      expect(isNumeric(NaN)).toBe(false);
    });

    test('returns false for Infinity', () => {
      expect(isNumeric(Infinity)).toBe(false);
      expect(isNumeric(-Infinity)).toBe(false);
    });
  });

  describe('with strings', () => {
    test('returns true for numeric strings', () => {
      expect(isNumeric('42')).toBe(true);
      expect(isNumeric('3.14')).toBe(true);
      expect(isNumeric('-5')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    test('returns true for numeric strings with whitespace', () => {
      expect(isNumeric('  42  ')).toBe(true);
      expect(isNumeric('\t3.14\n')).toBe(true);
    });

    test('returns false for empty strings', () => {
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('   ')).toBe(false);
    });

    test('returns false for non-numeric strings', () => {
      expect(isNumeric('hello')).toBe(false);
      expect(isNumeric('42a')).toBe(false);
      expect(isNumeric('$100')).toBe(false);
    });
  });

  describe('with other types', () => {
    test('returns false for null', () => {
      expect(isNumeric(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isNumeric(undefined)).toBe(false);
    });

    test('returns false for objects', () => {
      expect(isNumeric({})).toBe(false);
      expect(isNumeric([])).toBe(false);
    });

    test('returns false for booleans', () => {
      expect(isNumeric(true)).toBe(false);
      expect(isNumeric(false)).toBe(false);
    });
  });
});

describe('validateLoanField', () => {
  describe('loan-name validation', () => {
    test('returns true for non-empty name', () => {
      expect(validateLoanField('loan-name', 'Student Loan')).toBe(true);
      expect(validateLoanField('loan-name', 'A')).toBe(true);
    });

    test('returns false for empty name', () => {
      expect(validateLoanField('loan-name', '')).toBe(false);
    });
  });

  describe('current-balance validation', () => {
    test('returns true for valid amounts', () => {
      expect(validateLoanField('current-balance', '10000')).toBe(true);
      expect(validateLoanField('current-balance', '0')).toBe(true);
      expect(validateLoanField('current-balance', '1000.50')).toBe(true);
    });

    test('returns true for formatted currency', () => {
      expect(validateLoanField('current-balance', '$10,000')).toBe(true);
      expect(validateLoanField('current-balance', '$1,234.56')).toBe(true);
    });

    test('returns false for negative amounts', () => {
      expect(validateLoanField('current-balance', '-100')).toBe(false);
    });

    test('returns false for non-numeric values', () => {
      expect(validateLoanField('current-balance', 'abc')).toBe(false);
      expect(validateLoanField('current-balance', '')).toBe(false);
    });
  });

  describe('minimum-payment validation', () => {
    test('returns true for valid amounts', () => {
      expect(validateLoanField('minimum-payment', '200')).toBe(true);
      expect(validateLoanField('minimum-payment', '0')).toBe(true);
    });

    test('returns true for formatted currency', () => {
      expect(validateLoanField('minimum-payment', '$200')).toBe(true);
      expect(validateLoanField('minimum-payment', '$1,500')).toBe(true);
    });

    test('returns false for negative amounts', () => {
      expect(validateLoanField('minimum-payment', '-50')).toBe(false);
    });
  });

  describe('interest-rate validation', () => {
    test('returns true for valid rates', () => {
      expect(validateLoanField('interest-rate', '5.5')).toBe(true);
      expect(validateLoanField('interest-rate', '0')).toBe(true);
      expect(validateLoanField('interest-rate', '18')).toBe(true);
    });

    test('returns true for formatted percentages', () => {
      expect(validateLoanField('interest-rate', '5.5%')).toBe(true);
      expect(validateLoanField('interest-rate', '10%')).toBe(true);
    });

    test('allows negative rates', () => {
      // Negative interest rates are technically valid (though rare)
      expect(validateLoanField('interest-rate', '-0.5')).toBe(true);
    });

    test('returns false for non-numeric values', () => {
      expect(validateLoanField('interest-rate', 'abc')).toBe(false);
      expect(validateLoanField('interest-rate', '')).toBe(false);
    });
  });
});

describe('parseCurrency', () => {
  test('parses plain numbers', () => {
    expect(parseCurrency('1000')).toBe(1000);
    expect(parseCurrency('0')).toBe(0);
  });

  test('parses currency formatted strings', () => {
    expect(parseCurrency('$1,000')).toBe(1000);
    expect(parseCurrency('$10,000.50')).toBe(10000.5);
  });

  test('parses decimal amounts', () => {
    expect(parseCurrency('99.99')).toBe(99.99);
    expect(parseCurrency('$1,234.56')).toBe(1234.56);
  });

  test('handles empty string', () => {
    expect(parseCurrency('')).toBe(0);
  });
});

describe('parsePercentage', () => {
  test('parses plain numbers', () => {
    expect(parsePercentage('5.5')).toBe(5.5);
    expect(parsePercentage('10')).toBe(10);
  });

  test('parses percentage formatted strings', () => {
    expect(parsePercentage('5.5%')).toBe(5.5);
    expect(parsePercentage('10%')).toBe(10);
  });

  test('parses negative percentages', () => {
    expect(parsePercentage('-0.5%')).toBe(-0.5);
  });

  test('handles empty string', () => {
    expect(parsePercentage('')).toBe(0);
  });
});

describe('formatCurrency', () => {
  test('formats as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  test('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('formats negative amounts', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });

  test('rounds to two decimal places', () => {
    expect(formatCurrency(99.999)).toBe('$100.00');
    expect(formatCurrency(10.001)).toBe('$10.00');
  });
});

describe('formatPercentage', () => {
  test('formats as percentage', () => {
    expect(formatPercentage(5.5)).toBe('5.5%');
    expect(formatPercentage(10)).toBe('10%');
  });

  test('formats zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  test('formats negative percentages', () => {
    expect(formatPercentage(-0.5)).toBe('-0.5%');
  });
});
