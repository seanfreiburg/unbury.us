/**
 * Money utility module for precise financial calculations
 * Uses decimal.js to avoid floating point arithmetic errors
 */
import Decimal from 'decimal.js';

// Configure Decimal for financial calculations
Decimal.set({
  precision: 20,        // High precision for intermediate calculations
  rounding: Decimal.ROUND_HALF_UP,  // Standard rounding for money
});

/**
 * Money class for precise currency calculations
 * Internally stores values as Decimal, outputs as number for compatibility
 */
export class Money {
  private value: Decimal;

  constructor(amount: number | string | Decimal | Money) {
    if (amount instanceof Money) {
      this.value = amount.value;
    } else if (amount instanceof Decimal) {
      this.value = amount;
    } else {
      this.value = new Decimal(amount || 0);
    }
  }

  /**
   * Create Money from a number of cents
   */
  static fromCents(cents: number): Money {
    return new Money(new Decimal(cents).dividedBy(100));
  }

  /**
   * Add another Money amount
   */
  add(other: Money | number): Money {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return new Money(this.value.plus(otherMoney.value));
  }

  /**
   * Subtract another Money amount
   */
  subtract(other: Money | number): Money {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return new Money(this.value.minus(otherMoney.value));
  }

  /**
   * Multiply by a number (e.g., for interest rate calculations)
   */
  multiply(factor: number | Decimal): Money {
    return new Money(this.value.times(factor));
  }

  /**
   * Divide by a number
   */
  divide(divisor: number | Decimal): Money {
    return new Money(this.value.dividedBy(divisor));
  }

  /**
   * Check if this amount is greater than another
   */
  greaterThan(other: Money | number): boolean {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return this.value.greaterThan(otherMoney.value);
  }

  /**
   * Check if this amount is greater than or equal to another
   */
  greaterThanOrEqualTo(other: Money | number): boolean {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return this.value.greaterThanOrEqualTo(otherMoney.value);
  }

  /**
   * Check if this amount is less than another
   */
  lessThan(other: Money | number): boolean {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return this.value.lessThan(otherMoney.value);
  }

  /**
   * Check if this amount is less than or equal to another
   */
  lessThanOrEqualTo(other: Money | number): boolean {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return this.value.lessThanOrEqualTo(otherMoney.value);
  }

  /**
   * Check if this amount equals another
   */
  equals(other: Money | number): boolean {
    const otherMoney = other instanceof Money ? other : new Money(other);
    return this.value.equals(otherMoney.value);
  }

  /**
   * Check if this amount is zero
   */
  isZero(): boolean {
    return this.value.isZero();
  }

  /**
   * Check if this amount is positive
   */
  isPositive(): boolean {
    return this.value.isPositive();
  }

  /**
   * Check if this amount is negative
   */
  isNegative(): boolean {
    return this.value.isNegative();
  }

  /**
   * Get the absolute value
   */
  abs(): Money {
    return new Money(this.value.abs());
  }

  /**
   * Round to specified decimal places (default 2 for currency)
   */
  round(decimalPlaces: number = 2): Money {
    return new Money(this.value.toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP));
  }

  /**
   * Convert to number (rounded to 2 decimal places)
   * Use this for output/display only
   */
  toNumber(): number {
    return this.value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
  }

  /**
   * Convert to number with specified decimal places
   */
  toNumberWithDecimals(decimalPlaces: number): number {
    return this.value.toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP).toNumber();
  }

  /**
   * Get the raw Decimal value for complex calculations
   */
  toDecimal(): Decimal {
    return this.value;
  }

  /**
   * Format as currency string
   */
  format(): string {
    const num = this.toNumber();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  }

  /**
   * Convert to cents (integer)
   */
  toCents(): number {
    return this.value.times(100).round().toNumber();
  }
}

/**
 * Helper function to create Money instance
 */
export function money(amount: number | string | Money): Money {
  return new Money(amount);
}

/**
 * Calculate monthly interest rate from annual rate
 * @param annualRate - Annual interest rate as percentage (e.g., 5.5 for 5.5%)
 * @returns Monthly interest rate as decimal (e.g., 0.004583 for 5.5% annual)
 */
export function monthlyInterestRate(annualRate: number): Decimal {
  return new Decimal(annualRate).dividedBy(100).dividedBy(12);
}

/**
 * Calculate interest on a balance
 * @param balance - Current balance
 * @param annualRate - Annual interest rate as percentage
 * @returns Monthly interest amount
 */
export function calculateMonthlyInterest(balance: Money, annualRate: number): Money {
  const rate = monthlyInterestRate(annualRate);
  return balance.multiply(rate).round();
}
