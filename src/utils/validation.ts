// Validation utilities - framework agnostic (no jQuery)

export type LoanFieldName =
  | 'loan-name'
  | 'current-balance'
  | 'minimum-payment'
  | 'interest-rate';

/**
 * Check if a value is numeric (replacement for $.isNumeric)
 */
export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false;
    return !isNaN(Number(trimmed)) && isFinite(Number(trimmed));
  }
  return false;
}

/**
 * Validate a loan field value
 */
export function validateLoanField(fieldName: LoanFieldName, newValue: string): boolean {
  switch (fieldName) {
    case 'loan-name':
      return newValue.length > 0;
    case 'current-balance':
    case 'minimum-payment': {
      const cleanedValue = newValue.replace(/[$,]+/g, '');
      return isNumeric(cleanedValue) && Number(cleanedValue) >= 0;
    }
    case 'interest-rate': {
      const cleanedValue = newValue.replace(/[$,%]+/g, '');
      return isNumeric(cleanedValue);
    }
  }
  return false;
}

/**
 * Parse a currency string to a number
 */
export function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.]+/g, ''));
}

/**
 * Parse a percentage string to a number
 */
export function parsePercentage(value: string): number {
  return Number(value.replace(/[^0-9.-]+/g, ''));
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}
