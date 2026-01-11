import { useEffect, useCallback, useRef } from 'react';
import type { LoanData, PaymentType } from '../utils/calculator';

interface HashState {
  loans: Record<number, LoanData>;
  monthlyPayment: number;
  paymentType: PaymentType;
}

/**
 * Parse URL hash into state
 * Format: #name_0=StudentLoan&balance_0=50000&payment_0=500&rate_0=6.8&monthly_payment=1500&payment_type=avalanche
 */
export function parseHash(hash: string): Partial<HashState> {
  if (!hash || hash === '#') {
    return {};
  }

  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const loans: Record<number, LoanData> = {};
  let monthlyPayment: number | undefined;
  let paymentType: PaymentType | undefined;

  // Find all loan indices
  const loanIndices = new Set<number>();
  for (const key of params.keys()) {
    const match = key.match(/^(name|balance|payment|rate)_(\d+)$/);
    if (match) {
      loanIndices.add(parseInt(match[2], 10));
    }
  }

  // Parse each loan
  for (const index of loanIndices) {
    const name = params.get(`name_${index}`) || '';
    const balance = parseFloat(params.get(`balance_${index}`) || '0');
    const payment = parseFloat(params.get(`payment_${index}`) || '0');
    const rate = parseFloat(params.get(`rate_${index}`) || '0');

    if (name || balance || payment || rate) {
      loans[index] = {
        id: index,
        loanName: name,
        currentBalance: balance,
        minimumPayment: payment,
        interestRate: rate,
      };
    }
  }

  // Parse monthly payment
  const monthlyPaymentStr = params.get('monthly_payment');
  if (monthlyPaymentStr) {
    monthlyPayment = parseFloat(monthlyPaymentStr);
  }

  // Parse payment type
  const paymentTypeStr = params.get('payment_type');
  if (paymentTypeStr === 'avalanche' || paymentTypeStr === 'snowball') {
    paymentType = paymentTypeStr;
  }

  const result: Partial<HashState> = {};
  if (Object.keys(loans).length > 0) {
    result.loans = loans;
  }
  if (monthlyPayment !== undefined) {
    result.monthlyPayment = monthlyPayment;
  }
  if (paymentType !== undefined) {
    result.paymentType = paymentType;
  }

  return result;
}

/**
 * Convert state to URL hash string
 */
export function toHash(state: HashState): string {
  const params = new URLSearchParams();

  // Add loans
  for (const [id, loan] of Object.entries(state.loans)) {
    if (loan.loanName) params.set(`name_${id}`, loan.loanName);
    if (loan.currentBalance) params.set(`balance_${id}`, String(loan.currentBalance));
    if (loan.minimumPayment) params.set(`payment_${id}`, String(loan.minimumPayment));
    if (loan.interestRate) params.set(`rate_${id}`, String(loan.interestRate));
  }

  // Add monthly payment
  if (state.monthlyPayment) {
    params.set('monthly_payment', String(state.monthlyPayment));
  }

  // Add payment type
  if (state.paymentType) {
    params.set('payment_type', state.paymentType);
  }

  const hashString = params.toString();
  return hashString ? `#${hashString}` : '';
}

/**
 * Hook to sync state with URL hash
 */
export function useHashState(
  state: HashState,
  onHashChange: (parsed: Partial<HashState>) => void
): void {
  const isUpdatingRef = useRef(false);

  // Update hash when state changes
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }

    const newHash = toHash(state);
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash || window.location.pathname);
    }
  }, [state]);

  // Listen for hash changes (back/forward navigation)
  const handleHashChange = useCallback(() => {
    isUpdatingRef.current = true;
    const parsed = parseHash(window.location.hash);
    onHashChange(parsed);
  }, [onHashChange]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);
}

/**
 * Get initial state from URL hash
 */
export function getInitialStateFromHash(): Partial<HashState> {
  return parseHash(window.location.hash);
}

export default useHashState;
