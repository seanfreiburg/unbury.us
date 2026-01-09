// Application Controller - manages app state and payment type
import { ResultsController } from './results-controller.js';
import { GraphController } from './graph-controller.js';
import { LoanController } from './loan-controller.js';

export const ApplicationController = {
  changePaymentType(context) {
    const button = $(context);
    if (button.attr('id') == 'avalanche-btn') {
      if (button.hasClass('btn-secondary')) {
        button.removeClass('btn-secondary').addClass('btn-primary');
        $('#snowball-btn').removeClass('btn-primary').addClass('btn-secondary');
        window.payment_type = 'avalanche';
      }
    } else {
      // snowball clicked
      if (button.hasClass('btn-secondary')) {
        button.removeClass('btn-secondary').addClass('btn-primary');
        $('#avalanche-btn').removeClass('btn-primary').addClass('btn-secondary');
        window.payment_type = 'snowball';
      }
    }
  },

  monthlyPaymentInputChange() {
    const selector = $('#monthly-payment');
    let value = selector.val();
    let minMonthlyPayment = 0;
    for (const key in window.loans) {
      minMonthlyPayment += window.loans[key].minimumPayment;
    }
    value = value.replace(/[$,]+/g, '');
    value = ResultsController.preciseRound(value, 2);
    minMonthlyPayment = ResultsController.preciseRound(minMonthlyPayment, 2);
    if ($.isNumeric(value) && Number(value) >= minMonthlyPayment) {
      window.monthly_payment = Number(value);
    } else {
      window.monthly_payment = minMonthlyPayment;
      selector.val(minMonthlyPayment);
    }
  },

  calculate() {
    if (objectSize(window.loans) == 0) {
      alert('Add a loan!');
    } else if (!LoanController.valid()) {
      const results = ResultsController.results();
      GraphController.graph(results);
    } else {
      alert('At least one of your loans is invalid!');
    }
  },

  autoCalculate() {
    if (!LoanController.valid()) {
      const results = ResultsController.results();
      GraphController.graph(results);
    }
  },
};

// Helper function
function objectSize(obj) {
  return Object.keys(obj).length;
}

export default ApplicationController;
