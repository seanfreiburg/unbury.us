// Pure calculation functions for loan payoff - framework agnostic
import dayjs from 'dayjs';
import { Money, money, calculateMonthlyInterest } from './money';

export interface LoanData {
  id: number;
  loanName: string;
  currentBalance: number;
  minimumPayment: number;
  interestRate: number;
}

export interface LoanRow {
  date: string;
  payment: number;
  principal_paid: number;
  interest_paid: number;
  balance_remaining: number;
}

export interface LoanResult {
  rows: LoanRow[];
  loan_name: string;
  total_date: string;
  total_interest_paid: number;
  id: string;
  starting_balance: number;
}

export interface LoanResultsTotals {
  total_date?: string;
  total_interest_paid?: number;
}

export interface LoanResults {
  loans: Record<string, LoanResult>;
  totals: LoanResultsTotals;
}

export type PaymentType = 'avalanche' | 'snowball';

/**
 * Round a number to specified decimal places using Money class for precision
 * @deprecated Use Money class directly for new code
 */
export function preciseRound(num: number, decimals: number): number {
  return money(num).round(decimals).toNumberWithDecimals(decimals);
}

function sortLoans(
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>,
  paymentType: PaymentType
): string[] {
  if (paymentType === 'snowball') {
    return Object.keys(remainingLoans).sort((a, b) => {
      return (
        currentInterest[a] + currentPrincipal[a] - (currentInterest[b] + currentPrincipal[b])
      );
    });
  } else {
    return Object.keys(remainingLoans).sort((a, b) => {
      return remainingLoans[b].interestRate - remainingLoans[a].interestRate;
    });
  }
}

function removeLoan(
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>,
  minimumPayments: Record<string, number>,
  loanKey: string
): void {
  delete remainingLoans[loanKey];
  delete currentPrincipal[loanKey];
  delete currentInterest[loanKey];
  delete minimumPayments[loanKey];
}

interface CalculationState {
  loanResults: LoanResults;
}

function logDefaultLine(state: CalculationState, id: string, date: dayjs.Dayjs): void {
  state.loanResults.loans[id].rows.push({
    date: date.format('MMMM YYYY'),
    payment: 0,
    principal_paid: 0,
    interest_paid: 0,
    balance_remaining: 0,
  });
}

function logPaymentLine(state: CalculationState, id: string, payment: number): void {
  const row = state.loanResults.loans[id].rows[state.loanResults.loans[id].rows.length - 1];
  row.payment += preciseRound(payment, 2);
  row.payment = preciseRound(row.payment, 2);
}

function logPrincipalPaidLine(state: CalculationState, id: string, principalPaid: number): void {
  const row = state.loanResults.loans[id].rows[state.loanResults.loans[id].rows.length - 1];
  row.principal_paid = preciseRound(row.principal_paid + principalPaid, 2);
  logPaymentLine(state, id, principalPaid);
}

function logInterestPaidLine(state: CalculationState, id: string, interestPaid: number): void {
  const row = state.loanResults.loans[id].rows[state.loanResults.loans[id].rows.length - 1];
  row.interest_paid = preciseRound(row.interest_paid + interestPaid, 2);
  logPaymentLine(state, id, interestPaid);
}

function logBalanceRemainingLine(state: CalculationState, id: string, balanceRemaining: number): void {
  const row = state.loanResults.loans[id].rows[state.loanResults.loans[id].rows.length - 1];
  row.balance_remaining += preciseRound(balanceRemaining, 2);
}

function logTotals(state: CalculationState, date: dayjs.Dayjs): void {
  state.loanResults.totals.total_date = date.format('MMMM YYYY');
  let totalInterestPaid = 0;
  for (const loanKey in state.loanResults.loans) {
    state.loanResults.loans[loanKey].total_interest_paid = 0;
    for (const lineKey in state.loanResults.loans[loanKey].rows) {
      state.loanResults.loans[loanKey].total_interest_paid +=
        state.loanResults.loans[loanKey].rows[lineKey].interest_paid;
    }
    state.loanResults.loans[loanKey].total_interest_paid = preciseRound(
      state.loanResults.loans[loanKey].total_interest_paid,
      2
    );
    state.loanResults.loans[loanKey].total_date =
      state.loanResults.loans[loanKey].rows[
        state.loanResults.loans[loanKey].rows.length - 1
      ].date;
    totalInterestPaid += state.loanResults.loans[loanKey].total_interest_paid;
  }
  state.loanResults.totals.total_interest_paid = preciseRound(totalInterestPaid, 2);
}

function principalApplyPayment(
  state: CalculationState,
  id: string,
  payment: number,
  principalDict: Record<string, number>
): number {
  if (principalDict[id] > payment) {
    logPrincipalPaidLine(state, id, payment);
    principalDict[id] = principalDict[id] - payment;
    return 0;
  } else if (principalDict[id] === payment) {
    logPrincipalPaidLine(state, id, payment);
    principalDict[id] = principalDict[id] - payment;
    return 0;
  } else {
    logPrincipalPaidLine(state, id, principalDict[id]);
    const remainingPayment = payment - principalDict[id];
    principalDict[id] = 0;
    return remainingPayment;
  }
}

function applyPayment(
  state: CalculationState,
  id: string,
  payment: number,
  interestDict: Record<string, number>,
  principalDict: Record<string, number>
): number {
  if (interestDict[id] > payment) {
    logInterestPaidLine(state, id, payment);
    interestDict[id] = interestDict[id] - payment;
    return 0;
  } else if (interestDict[id] === payment) {
    logInterestPaidLine(state, id, payment);
    interestDict[id] = interestDict[id] - payment;
    return 0;
  } else {
    logInterestPaidLine(state, id, interestDict[id]);
    const remainingPayment = payment - interestDict[id];
    interestDict[id] = 0;
    return principalApplyPayment(state, id, remainingPayment, principalDict);
  }
}

function payMinimums(
  state: CalculationState,
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>,
  minimumPayments: Record<string, number>
): void {
  for (const loanKey in remainingLoans) {
    const leftOver = applyPayment(
      state,
      loanKey,
      minimumPayments[loanKey],
      currentInterest,
      currentPrincipal
    );
    minimumPayments[loanKey] = leftOver;
  }
}

function addLeftoverPayments(minimumPayments: Record<string, number>): number {
  let leftover = 0;
  for (const key in minimumPayments) {
    leftover += minimumPayments[key];
  }
  return leftover;
}

function removePaidOffLoans(
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>,
  minimumPayments: Record<string, number>
): void {
  for (const loanKey in remainingLoans) {
    const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
    if (currentBalance === 0) {
      removeLoan(remainingLoans, currentPrincipal, currentInterest, minimumPayments, loanKey);
    }
  }
}

function addInterest(
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>
): void {
  for (const loanKey in remainingLoans) {
    const currentBalance = money(currentPrincipal[loanKey]).add(currentInterest[loanKey]);
    const interestGenerated = calculateMonthlyInterest(currentBalance, remainingLoans[loanKey].interestRate);
    currentInterest[loanKey] = money(currentInterest[loanKey]).add(interestGenerated).toNumber();
  }
}

function applyExtraPayments(
  state: CalculationState,
  remainingLoans: Record<string, LoanData>,
  currentPrincipal: Record<string, number>,
  currentInterest: Record<string, number>,
  paymentType: PaymentType,
  extraPayment: number,
  minimumPayments: Record<string, number>
): number {
  const sortedKeys = sortLoans(remainingLoans, currentPrincipal, currentInterest, paymentType);
  for (const key in sortedKeys) {
    if (extraPayment === 0 || Object.keys(remainingLoans).length === 0) {
      return extraPayment;
    }
    extraPayment = applyPayment(
      state,
      sortedKeys[key],
      extraPayment,
      currentInterest,
      currentPrincipal
    );
    if (currentPrincipal[sortedKeys[key]] + currentInterest[sortedKeys[key]] === 0) {
      removeLoan(
        remainingLoans,
        currentPrincipal,
        currentInterest,
        minimumPayments,
        sortedKeys[key]
      );
    }
  }
  return extraPayment;
}

/**
 * Calculate loan payoff schedule using avalanche or snowball method
 * @param loans - Array of loan data
 * @param paymentType - 'avalanche' (highest interest first) or 'snowball' (lowest balance first)
 * @param monthlyPayment - Total monthly payment amount
 * @returns LoanResults with payoff schedule, or null if payoff exceeds 122 years
 */
export function calculateLoanPayoff(
  loans: LoanData[],
  paymentType: PaymentType,
  monthlyPayment: number
): LoanResults | null {
  const state: CalculationState = {
    loanResults: { loans: {}, totals: {} },
  };

  const remainingLoans: Record<string, LoanData> = {};
  const currentPrincipal: Record<string, number> = {};
  const currentInterest: Record<string, number> = {};
  const minimumPayments: Record<string, number> = {};
  let month = dayjs().startOf('month');

  for (const loanKey in loans) {
    state.loanResults.loans[loanKey] = {
      rows: [],
      loan_name: loans[loanKey].loanName,
      total_date: '0',
      total_interest_paid: 0,
      id: loanKey,
      starting_balance: loans[loanKey].currentBalance,
    };
    currentPrincipal[loanKey] = loans[loanKey].currentBalance;
    currentInterest[loanKey] = 0;
    remainingLoans[loanKey] = loans[loanKey];
    logDefaultLine(state, loanKey, month);
    const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
    logBalanceRemainingLine(state, loanKey, currentBalance);
  }

  let counter = 0;
  while (Object.keys(remainingLoans).length > 0) {
    counter++;
    if (counter > 12 * 122) {
      return null; // Payoff exceeds 122 years
    }
    month = month.add(1, 'month');
    let extraPayment = monthlyPayment;
    for (const loanKey in remainingLoans) {
      minimumPayments[loanKey] = remainingLoans[loanKey].minimumPayment;
      extraPayment = extraPayment - minimumPayments[loanKey];
      logDefaultLine(state, loanKey, month);
    }
    payMinimums(state, remainingLoans, currentPrincipal, currentInterest, minimumPayments);
    extraPayment = extraPayment + addLeftoverPayments(minimumPayments);
    removePaidOffLoans(remainingLoans, currentPrincipal, currentInterest, minimumPayments);
    applyExtraPayments(
      state,
      remainingLoans,
      currentPrincipal,
      currentInterest,
      paymentType,
      extraPayment,
      minimumPayments
    );
    for (const loanKey in remainingLoans) {
      const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
      logBalanceRemainingLine(state, loanKey, currentBalance);
    }
    addInterest(remainingLoans, currentPrincipal, currentInterest);
  }

  logTotals(state, month);
  return state.loanResults;
}

/**
 * Get the total minimum payment across all loans
 */
export function getTotalMinimumPayment(loans: LoanData[]): number {
  return loans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
}
