// Router - manages event bindings
import { ApplicationController } from './application-controller.js';
import { LoanController } from './loan-controller.js';

export const Router = {
  init() {
    $('#add-loan').click(function () {
      LoanController.addLoan();
    });

    $('#avalanche-btn').click(function () {
      ApplicationController.changePaymentType(this);
      ApplicationController.autoCalculate();
    });

    $('#snowball-btn').click(function () {
      ApplicationController.changePaymentType(this);
      ApplicationController.autoCalculate();
    });
  },

  addMonthlyPaymentListener() {
    $('#monthly-payment').change(function () {
      ApplicationController.monthlyPaymentInputChange();
      location.hash = LoanController.hashString();
      ApplicationController.autoCalculate();
    });
  },

  addLoanDestroyListener(id) {
    $('#destroy-button-' + id).click(function () {
      LoanController.removeLoan(id);
      location.hash = LoanController.hashString();
      ApplicationController.autoCalculate();
    });
  },

  addLoanInputListeners(id) {
    this.addLoanInputListener(id, 'loan-name');
    this.addLoanInputListener(id, 'current-balance');
    this.addLoanInputListener(id, 'minimum-payment');
    this.addLoanInputListener(id, 'interest-rate');
  },

  addLoanInputListener(id, fieldName) {
    $('#loan' + id)
      .find('input[name=' + fieldName + ']')
      .change(function () {
        LoanController.loanInputChange(id, fieldName, this);
        ApplicationController.monthlyPaymentInputChange();
        location.hash = LoanController.hashString();
        ApplicationController.autoCalculate();
      });
  },

  addCalculateListener() {
    $('#calculate').click(function () {
      ApplicationController.calculate();
    });
  },

  addLoanTableResultListener(id) {
    $('#loan-head-' + id).click(function () {
      $(this).next().next().toggle();
      if ($(this).find('.bi-chevron-right').length > 0) {
        $(this).find('.arrow').removeClass('bi-chevron-right').addClass('bi-chevron-down');
      } else {
        $(this).find('.arrow').removeClass('bi-chevron-down').addClass('bi-chevron-right');
      }
    });
  },
};

export default Router;
