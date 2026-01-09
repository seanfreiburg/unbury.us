// Router - manages event bindings
import { ApplicationController } from './application-controller';
import { LoanController } from './loan-controller';
import type { LoanFieldName } from './loan';


export const Router = {
  init(): void {
    $('#add-loan').click(function () {
      LoanController.addLoan();
    });

    $('#avalanche-btn').click(function (this: HTMLElement) {
      ApplicationController.changePaymentType(this);
      ApplicationController.autoCalculate();
    });

    $('#snowball-btn').click(function (this: HTMLElement) {
      ApplicationController.changePaymentType(this);
      ApplicationController.autoCalculate();
    });
  },

  addMonthlyPaymentListener(): void {
    $('#monthly-payment').change(function () {
      ApplicationController.monthlyPaymentInputChange();
      location.hash = LoanController.hashString();
      ApplicationController.autoCalculate();
    });
  },

  addLoanDestroyListener(id: number): void {
    $('#destroy-button-' + id).click(function () {
      LoanController.removeLoan(id);
      location.hash = LoanController.hashString();
      ApplicationController.autoCalculate();
    });
  },

  addLoanInputListeners(id: number): void {
    this.addLoanInputListener(id, 'loan-name');
    this.addLoanInputListener(id, 'current-balance');
    this.addLoanInputListener(id, 'minimum-payment');
    this.addLoanInputListener(id, 'interest-rate');
  },

  addLoanInputListener(id: number, fieldName: LoanFieldName): void {
    $('#loan' + id)
      .find('input[name=' + fieldName + ']')
      .change(function (this: HTMLElement) {
        LoanController.loanInputChange(id, fieldName, this);
        ApplicationController.monthlyPaymentInputChange();
        location.hash = LoanController.hashString();
        ApplicationController.autoCalculate();
      });
  },

  addCalculateListener(): void {
    $('#calculate').click(function () {
      ApplicationController.calculate();
    });
  },

  addLoanTableResultListener(id: string): void {
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
