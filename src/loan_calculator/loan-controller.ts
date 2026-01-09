// Loan Controller - manages loan CRUD operations
import { Loan, LoanFieldName } from './loan';

declare const Handlebars: {
  compile: (template: string) => (context: unknown) => string;
};

interface WindowWithAppState {
  auto_increment: number;
  loans: Record<number, Loan>;
  monthly_payment: number;
  Router: {
    addLoanDestroyListener: (id: number) => void;
    addLoanInputListeners: (id: number) => void;
  };
}

export const LoanController = {
  addLoan(): void {
    const win = window as unknown as WindowWithAppState;
    win.auto_increment += 1;
    const id = win.auto_increment;
    const source = $('#loan-input-template').html();
    const template = Handlebars.compile(source);
    const context = { id: id };
    const html = template(context);
    $('#loan-inputs').append(html);
    $('#loan' + id)
      .hide()
      .fadeIn('500');
    win.loans[id] = new Loan(id, '', 0, 0, 0);
    win.Router.addLoanDestroyListener(id);
    win.Router.addLoanInputListeners(id);
  },

  removeLoan(id: number): void {
    const loanDiv = $('#loan' + id);
    loanDiv.next().remove();
    loanDiv.animate({ height: 0, opacity: 0 }, 'slow', function () {
      $(this).remove();
    });
    delete (window as unknown as WindowWithAppState).loans[id];
  },

  loanInputChange(id: number, fieldName: LoanFieldName, context: HTMLElement): void {
    const value = $(context).val() as string;
    const loan = (window as unknown as WindowWithAppState).loans[id];

    if (Loan.validateField(fieldName, value)) {
      $(context).removeClass('input-error').addClass('input-success');
      loan.setLoanField(fieldName, value);
    } else {
      $(context).removeClass('input-success').addClass('input-error');
    }
  },

  valid(): number {
    return $('.input-error').length;
  },

  hashString(): string {
    const win = window as unknown as WindowWithAppState;
    let hashString = '';
    hashString += 'monthly_payment=' + win.monthly_payment + '&';
    for (const key in win.loans) {
      const loan = win.loans[key];
      hashString += 'name_' + loan.id + '=' + loan.loanName + '&';
      hashString += 'balance_' + loan.id + '=' + loan.currentBalance + '&';
      hashString += 'payment_' + loan.id + '=' + loan.minimumPayment + '&';
      hashString += 'rate_' + loan.id + '=' + loan.interestRate + '&';
    }
    return hashString;
  },
};

export default LoanController;
