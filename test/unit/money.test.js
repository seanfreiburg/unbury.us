import { describe, test, expect } from 'vitest';
import { Money, money, monthlyInterestRate, calculateMonthlyInterest } from '../../src/utils/money';

describe('Money class', () => {
  describe('constructor', () => {
    test('creates Money from number', () => {
      const m = new Money(100.50);
      expect(m.toNumber()).toBe(100.5);
    });

    test('creates Money from string', () => {
      const m = new Money('100.50');
      expect(m.toNumber()).toBe(100.5);
    });

    test('creates Money from another Money instance', () => {
      const m1 = new Money(100.50);
      const m2 = new Money(m1);
      expect(m2.toNumber()).toBe(100.5);
    });

    test('handles null/undefined as 0', () => {
      const m = new Money(null);
      expect(m.toNumber()).toBe(0);
    });
  });

  describe('fromCents', () => {
    test('converts cents to dollars', () => {
      expect(Money.fromCents(1050).toNumber()).toBe(10.5);
    });

    test('handles zero cents', () => {
      expect(Money.fromCents(0).toNumber()).toBe(0);
    });

    test('handles fractional cents', () => {
      expect(Money.fromCents(999).toNumber()).toBe(9.99);
    });
  });

  describe('arithmetic operations', () => {
    test('add with Money', () => {
      const m1 = money(10.50);
      const m2 = money(5.25);
      expect(m1.add(m2).toNumber()).toBe(15.75);
    });

    test('add with number', () => {
      const m = money(10.50);
      expect(m.add(5.25).toNumber()).toBe(15.75);
    });

    test('subtract with Money', () => {
      const m1 = money(10.50);
      const m2 = money(5.25);
      expect(m1.subtract(m2).toNumber()).toBe(5.25);
    });

    test('subtract with number', () => {
      const m = money(10.50);
      expect(m.subtract(5.25).toNumber()).toBe(5.25);
    });

    test('multiply', () => {
      const m = money(10.50);
      expect(m.multiply(2).toNumber()).toBe(21);
    });

    test('multiply by decimal', () => {
      const m = money(100);
      expect(m.multiply(0.05).toNumber()).toBe(5);
    });

    test('divide', () => {
      const m = money(10.50);
      expect(m.divide(2).toNumber()).toBe(5.25);
    });

    test('divide by decimal', () => {
      const m = money(100);
      expect(m.divide(12).toNumber()).toBe(8.33);
    });
  });

  describe('floating point precision', () => {
    test('0.1 + 0.2 equals 0.3', () => {
      // This fails with native JS: 0.1 + 0.2 = 0.30000000000000004
      const result = money(0.1).add(0.2);
      expect(result.toNumber()).toBe(0.3);
    });

    test('handles repeated additions accurately', () => {
      let total = money(0);
      for (let i = 0; i < 10; i++) {
        total = total.add(0.1);
      }
      expect(total.toNumber()).toBe(1);
    });

    test('compound interest calculation maintains precision', () => {
      // $1000 at 5% monthly for 12 months
      let balance = money(1000);
      for (let i = 0; i < 12; i++) {
        balance = balance.multiply(1.05);
      }
      expect(balance.toNumber()).toBe(1795.86);
    });
  });

  describe('comparison operations', () => {
    test('greaterThan', () => {
      expect(money(10).greaterThan(5)).toBe(true);
      expect(money(10).greaterThan(10)).toBe(false);
      expect(money(10).greaterThan(15)).toBe(false);
    });

    test('greaterThanOrEqualTo', () => {
      expect(money(10).greaterThanOrEqualTo(5)).toBe(true);
      expect(money(10).greaterThanOrEqualTo(10)).toBe(true);
      expect(money(10).greaterThanOrEqualTo(15)).toBe(false);
    });

    test('lessThan', () => {
      expect(money(10).lessThan(15)).toBe(true);
      expect(money(10).lessThan(10)).toBe(false);
      expect(money(10).lessThan(5)).toBe(false);
    });

    test('lessThanOrEqualTo', () => {
      expect(money(10).lessThanOrEqualTo(15)).toBe(true);
      expect(money(10).lessThanOrEqualTo(10)).toBe(true);
      expect(money(10).lessThanOrEqualTo(5)).toBe(false);
    });

    test('equals', () => {
      expect(money(10).equals(10)).toBe(true);
      expect(money(10).equals(money(10))).toBe(true);
      expect(money(10).equals(10.01)).toBe(false);
    });
  });

  describe('boolean checks', () => {
    test('isZero', () => {
      expect(money(0).isZero()).toBe(true);
      expect(money(0.00).isZero()).toBe(true);
      expect(money(0.01).isZero()).toBe(false);
    });

    test('isPositive', () => {
      expect(money(10).isPositive()).toBe(true);
      expect(money(0).isPositive()).toBe(true); // 0 is non-negative
      expect(money(-10).isPositive()).toBe(false);
    });

    test('isNegative', () => {
      expect(money(-10).isNegative()).toBe(true);
      expect(money(0).isNegative()).toBe(false);
      expect(money(10).isNegative()).toBe(false);
    });
  });

  describe('abs', () => {
    test('returns absolute value', () => {
      expect(money(-10).abs().toNumber()).toBe(10);
      expect(money(10).abs().toNumber()).toBe(10);
      expect(money(0).abs().toNumber()).toBe(0);
    });
  });

  describe('rounding', () => {
    test('round to 2 decimal places by default', () => {
      expect(money(10.555).round().toNumber()).toBe(10.56);
      expect(money(10.554).round().toNumber()).toBe(10.55);
    });

    test('round to specified decimal places', () => {
      expect(money(10.5555).round(3).toNumberWithDecimals(3)).toBe(10.556);
      expect(money(10.5).round(0).toNumberWithDecimals(0)).toBe(11);
    });
  });

  describe('conversion methods', () => {
    test('toNumber returns rounded to 2 decimals', () => {
      expect(money(10.555).toNumber()).toBe(10.56);
    });

    test('toNumberWithDecimals returns specified precision', () => {
      expect(money(10.5555).toNumberWithDecimals(3)).toBe(10.556);
      expect(money(10.5555).toNumberWithDecimals(1)).toBe(10.6);
    });

    test('toCents returns integer cents', () => {
      expect(money(10.50).toCents()).toBe(1050);
      expect(money(10.555).toCents()).toBe(1056);
    });

    test('format returns currency string', () => {
      expect(money(1234.56).format()).toBe('$1,234.56');
      expect(money(0).format()).toBe('$0.00');
      expect(money(-100).format()).toBe('-$100.00');
    });
  });
});

describe('Helper functions', () => {
  describe('money()', () => {
    test('creates Money instance', () => {
      const m = money(100);
      expect(m).toBeInstanceOf(Money);
      expect(m.toNumber()).toBe(100);
    });
  });

  describe('monthlyInterestRate()', () => {
    test('converts annual rate to monthly decimal', () => {
      // 12% annual = 1% monthly = 0.01
      const rate = monthlyInterestRate(12);
      expect(rate.toNumber()).toBeCloseTo(0.01, 6);
    });

    test('handles typical mortgage rate', () => {
      // 5.5% annual = ~0.458% monthly
      const rate = monthlyInterestRate(5.5);
      expect(rate.toNumber()).toBeCloseTo(0.004583, 5);
    });
  });

  describe('calculateMonthlyInterest()', () => {
    test('calculates monthly interest on balance', () => {
      // $10,000 at 12% annual = $100 monthly interest
      const interest = calculateMonthlyInterest(money(10000), 12);
      expect(interest.toNumber()).toBe(100);
    });

    test('calculates interest with typical rates', () => {
      // $50,000 at 6.8% annual
      const interest = calculateMonthlyInterest(money(50000), 6.8);
      expect(interest.toNumber()).toBe(283.33);
    });

    test('handles zero balance', () => {
      const interest = calculateMonthlyInterest(money(0), 12);
      expect(interest.toNumber()).toBe(0);
    });

    test('handles zero rate', () => {
      const interest = calculateMonthlyInterest(money(10000), 0);
      expect(interest.toNumber()).toBe(0);
    });
  });
});
