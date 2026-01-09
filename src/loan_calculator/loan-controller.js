// Loan Controller - manages loan CRUD operations
import { Loan } from './loan.js';

export const LoanController = {
  addLoan() {
    window.auto_increment += 1;
    const id = window.auto_increment;
    const source = $('#loan-input-template').html();
    const template = Handlebars.compile(source);
    const context = { id: id };
    const html = template(context);
    $('#loan-inputs').append(html);
    $('#loan' + id)
      .hide()
      .fadeIn('500');
    window.loans[id] = new Loan(id, 0, 0, 0, 0);
    window.Router.addLoanDestroyListener(id);
    window.Router.addLoanInputListeners(id);
  },

  removeLoan(id) {
    const loanDiv = $('#loan' + id);
    loanDiv.next().remove();
    loanDiv.animate({ height: 0, opacity: 0 }, 'slow', function () {
      $(this).remove();
    });
    delete window.loans[id];
  },

  loanInputChange(id, fieldName, context) {
    const value = $(context).val();
    const loan = window.loans[id];

    if (Loan.validateField(fieldName, value)) {
      $(context).removeClass('input-error').addClass('input-success');
      loan.setLoanField(fieldName, value);
    } else {
      $(context).removeClass('input-success').addClass('input-error');
    }
  },

  valid() {
    return $('.input-error').length;
  },

  hashString() {
    let hashString = '';
    hashString += 'monthly_payment=' + window.monthly_payment + '&';
    for (const key in window.loans) {
      const loan = window.loans[key];
      hashString += 'name_' + loan.id + '=' + loan.loanName + '&';
      hashString += 'balance_' + loan.id + '=' + loan.currentBalance + '&';
      hashString += 'payment_' + loan.id + '=' + loan.minimumPayment + '&';
      hashString += 'rate_' + loan.id + '=' + loan.interestRate + '&';
    }
    return hashString;
  },
};

export default LoanController;
