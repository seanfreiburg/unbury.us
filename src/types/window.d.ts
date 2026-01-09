// Window interface augmentation for app state
import type { Loan } from '../loan_calculator/loan';
import type { Router } from '../loan_calculator/router';

declare global {
  interface Window {
    // Loan calculator state
    loans: Record<string | number, Loan>;
    auto_increment: number;
    monthly_payment: number;
    payment_type: 'avalanche' | 'snowball';
    Router: typeof Router;

    // FI calculator state
    current_assets: number;
    savings_rate: number;
    current_salary: number;
    return_rate: number;
    years_of_savings: number;
    inflation_rate: number;
    [key: string]: unknown;
  }
}

export {};
