// Application Controller - manages app state and payment type
import { ResultsController } from './results-controller';
import { GraphController } from './graph-controller';
import { LoanController } from './loan-controller';
import type { Loan } from './loan';


type PaymentType = 'avalanche' | 'snowball';

interface WindowWithAppState extends Window {
  loans: Record<string, Loan>;
  monthly_payment: number;
  payment_type: PaymentType;
}

export const ApplicationController = {
  changePaymentType(context: HTMLElement): void {
    const button = $(context);
    if (button.attr('id') == 'avalanche-btn') {
      if (button.hasClass('btn-secondary')) {
        button.removeClass('btn-secondary').addClass('btn-primary');
        $('#snowball-btn').removeClass('btn-primary').addClass('btn-secondary');
        (window as unknown as WindowWithAppState).payment_type = 'avalanche';
      }
    } else {
      // snowball clicked
      if (button.hasClass('btn-secondary')) {
        button.removeClass('btn-secondary').addClass('btn-primary');
        $('#avalanche-btn').removeClass('btn-primary').addClass('btn-secondary');
        (window as unknown as WindowWithAppState).payment_type = 'snowball';
      }
    }
  },

  monthlyPaymentInputChange(): void {
    const selector = $('#monthly-payment');
    let value = selector.val() as string;
    let minMonthlyPayment = 0;
    const loans = (window as unknown as WindowWithAppState).loans;
    for (const key in loans) {
      minMonthlyPayment += loans[key].minimumPayment;
    }
    value = value.replace(/[$,]+/g, '');
    const numValue = ResultsController.preciseRound(Number(value), 2);
    minMonthlyPayment = ResultsController.preciseRound(minMonthlyPayment, 2);
    if ($.isNumeric(value) && numValue >= minMonthlyPayment) {
      (window as unknown as WindowWithAppState).monthly_payment = numValue;
    } else {
      (window as unknown as WindowWithAppState).monthly_payment = minMonthlyPayment;
      selector.val(minMonthlyPayment);
    }
  },

  calculate(): void {
    const loans = (window as unknown as WindowWithAppState).loans;
    if (objectSize(loans) == 0) {
      alert('Add a loan!');
    } else if (!LoanController.valid()) {
      const results = ResultsController.results();
      if (results) {
        GraphController.graph(results);
      }
    } else {
      alert('At least one of your loans is invalid!');
    }
  },

  autoCalculate(): void {
    if (!LoanController.valid()) {
      const results = ResultsController.results();
      if (results) {
        GraphController.graph(results);
      }
    }
  },
};

// Helper function
function objectSize(obj: Record<string, unknown>): number {
  return Object.keys(obj).length;
}

export default ApplicationController;
