import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { LoanData, LoanResults, PaymentType } from '../utils/calculator';
import { calculateLoanPayoff, getTotalMinimumPayment } from '../utils/calculator';
import type { LoanFieldName } from '../utils/validation';
import { parseCurrency, parsePercentage } from '../utils/validation';
import { useHashState, getInitialStateFromHash } from '../hooks/useHashState';

// State types
export interface LoanCalculatorState {
  loans: Record<number, LoanData>;
  autoIncrement: number;
  monthlyPayment: number;
  paymentType: PaymentType;
  results: LoanResults | null;
  isCalculating: boolean;
  error: string | null;
}

// Action types
type LoanCalculatorAction =
  | { type: 'ADD_LOAN' }
  | { type: 'REMOVE_LOAN'; id: number }
  | { type: 'UPDATE_LOAN_FIELD'; id: number; field: LoanFieldName; value: string }
  | { type: 'SET_MONTHLY_PAYMENT'; value: number }
  | { type: 'SET_PAYMENT_TYPE'; value: PaymentType }
  | { type: 'SET_RESULTS'; results: LoanResults | null }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_CALCULATING'; isCalculating: boolean }
  | { type: 'LOAD_FROM_HASH'; state: Partial<LoanCalculatorState> };

// Initial state
function getInitialState(): LoanCalculatorState {
  const hashState = getInitialStateFromHash();

  // Don't create a default loan - match jQuery behavior where user must click "add loan"
  const loans = hashState.loans || {};
  const loanKeys = Object.keys(loans).map(Number);
  const autoIncrement = loanKeys.length > 0 ? Math.max(...loanKeys) + 1 : 0;

  return {
    loans,
    autoIncrement,
    monthlyPayment: hashState.monthlyPayment || 0,
    paymentType: hashState.paymentType || 'avalanche',
    results: null,
    isCalculating: false,
    error: null,
  };
}

// Reducer
function loanCalculatorReducer(
  state: LoanCalculatorState,
  action: LoanCalculatorAction
): LoanCalculatorState {
  switch (action.type) {
    case 'ADD_LOAN': {
      const newLoan: LoanData = {
        id: state.autoIncrement,
        loanName: '',
        currentBalance: 0,
        minimumPayment: 0,
        interestRate: 0,
      };
      return {
        ...state,
        loans: { ...state.loans, [state.autoIncrement]: newLoan },
        autoIncrement: state.autoIncrement + 1,
      };
    }

    case 'REMOVE_LOAN': {
      const { [action.id]: removed, ...remainingLoans } = state.loans;
      return {
        ...state,
        loans: remainingLoans,
      };
    }

    case 'UPDATE_LOAN_FIELD': {
      const loan = state.loans[action.id];
      if (!loan) return state;

      let updatedLoan: LoanData;
      switch (action.field) {
        case 'loan-name':
          updatedLoan = { ...loan, loanName: action.value };
          break;
        case 'current-balance':
          updatedLoan = { ...loan, currentBalance: parseCurrency(action.value) };
          break;
        case 'minimum-payment':
          updatedLoan = { ...loan, minimumPayment: parseCurrency(action.value) };
          break;
        case 'interest-rate':
          updatedLoan = { ...loan, interestRate: parsePercentage(action.value) };
          break;
        default:
          return state;
      }

      return {
        ...state,
        loans: { ...state.loans, [action.id]: updatedLoan },
      };
    }

    case 'SET_MONTHLY_PAYMENT':
      return { ...state, monthlyPayment: action.value };

    case 'SET_PAYMENT_TYPE':
      return { ...state, paymentType: action.value };

    case 'SET_RESULTS':
      return { ...state, results: action.results, isCalculating: false };

    case 'SET_ERROR':
      return { ...state, error: action.error, isCalculating: false };

    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.isCalculating };

    case 'LOAD_FROM_HASH': {
      const newState = { ...state };
      if (action.state.loans) {
        newState.loans = action.state.loans;
        newState.autoIncrement = Math.max(...Object.keys(action.state.loans).map(Number), 0) + 1;
      }
      if (action.state.monthlyPayment !== undefined) {
        newState.monthlyPayment = action.state.monthlyPayment;
      }
      if (action.state.paymentType !== undefined) {
        newState.paymentType = action.state.paymentType;
      }
      return newState;
    }

    default:
      return state;
  }
}

// Context
interface LoanCalculatorContextValue {
  state: LoanCalculatorState;
  addLoan: () => void;
  removeLoan: (id: number) => void;
  updateLoanField: (id: number, field: LoanFieldName, value: string) => void;
  setMonthlyPayment: (value: number) => void;
  setPaymentType: (type: PaymentType) => void;
  calculate: () => void;
  totalMinimumPayment: number;
  isValid: boolean;
}

const LoanCalculatorContext = createContext<LoanCalculatorContextValue | null>(null);

// Provider
interface LoanCalculatorProviderProps {
  children: ReactNode;
  autoCalculate?: boolean;
}

export function LoanCalculatorProvider({
  children,
  autoCalculate = true,
}: LoanCalculatorProviderProps) {
  const [state, dispatch] = useReducer(loanCalculatorReducer, undefined, getInitialState);

  // Actions
  const addLoan = useCallback(() => {
    dispatch({ type: 'ADD_LOAN' });
  }, []);

  const removeLoan = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_LOAN', id });
  }, []);

  const updateLoanField = useCallback((id: number, field: LoanFieldName, value: string) => {
    dispatch({ type: 'UPDATE_LOAN_FIELD', id, field, value });
  }, []);

  const setMonthlyPayment = useCallback((value: number) => {
    dispatch({ type: 'SET_MONTHLY_PAYMENT', value });
  }, []);

  const setPaymentType = useCallback((type: PaymentType) => {
    dispatch({ type: 'SET_PAYMENT_TYPE', value: type });
    // Set window.payment_type for backwards compatibility with tests and jQuery version
    (window as Window & { payment_type: string }).payment_type = type;
  }, []);

  // Initialize window.payment_type on mount
  useEffect(() => {
    (window as Window & { payment_type: string }).payment_type = state.paymentType;
  }, []);

  const calculate = useCallback(() => {
    dispatch({ type: 'SET_CALCULATING', isCalculating: true });
    dispatch({ type: 'SET_ERROR', error: null });

    const loansArray = Object.values(state.loans);
    if (loansArray.length === 0) {
      dispatch({ type: 'SET_RESULTS', results: null });
      return;
    }

    const results = calculateLoanPayoff(loansArray, state.paymentType, state.monthlyPayment);

    if (results === null) {
      dispatch({
        type: 'SET_ERROR',
        error:
          'The loan payoff is more than 122 years. You probably need to pay more on the loan or you will never pay it off.',
      });
      dispatch({ type: 'SET_RESULTS', results: null });
    } else {
      dispatch({ type: 'SET_RESULTS', results });
    }
  }, [state.loans, state.paymentType, state.monthlyPayment]);

  // Computed values
  const totalMinimumPayment = getTotalMinimumPayment(Object.values(state.loans));

  const isValid =
    Object.values(state.loans).every(
      (loan) =>
        loan.loanName &&
        loan.currentBalance > 0 &&
        loan.minimumPayment > 0 &&
        loan.interestRate >= 0
    ) && state.monthlyPayment >= totalMinimumPayment;

  // Hash state sync
  const handleHashChange = useCallback((parsed: Partial<LoanCalculatorState>) => {
    dispatch({ type: 'LOAD_FROM_HASH', state: parsed });
  }, []);

  useHashState(
    {
      loans: state.loans,
      monthlyPayment: state.monthlyPayment,
      paymentType: state.paymentType,
    },
    handleHashChange
  );

  // Auto-calculate on state changes
  useEffect(() => {
    if (autoCalculate && isValid) {
      calculate();
    }
  }, [autoCalculate, isValid, calculate]);

  const value: LoanCalculatorContextValue = {
    state,
    addLoan,
    removeLoan,
    updateLoanField,
    setMonthlyPayment,
    setPaymentType,
    calculate,
    totalMinimumPayment,
    isValid,
  };

  return (
    <LoanCalculatorContext.Provider value={value}>{children}</LoanCalculatorContext.Provider>
  );
}

// Hook
export function useLoanCalculator(): LoanCalculatorContextValue {
  const context = useContext(LoanCalculatorContext);
  if (!context) {
    throw new Error('useLoanCalculator must be used within a LoanCalculatorProvider');
  }
  return context;
}

export default LoanCalculatorContext;
