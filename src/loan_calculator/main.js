// Main entry point for loan calculator
import { Loan } from './loan.js';
import { Router } from './router.js';
import { ApplicationController } from './application-controller.js';

// Polyfill for String.contains if not present
if (!String.prototype.contains) {
  String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
  };
}

// Math.sign polyfill
Math.sign =
  Math.sign ||
  function sign(x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };

// Make Router available globally for callbacks
window.Router = Router;

// URL parameter parsing
function getSearchParameters() {
  const prmstr = window.location.hash;
  return prmstr != null && prmstr != '' ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
  const params = {};
  const prmarr = prmstr.substr(1).split('&');
  for (let i = 0; i < prmarr.length; i++) {
    const tmparr = prmarr[i].split('=');
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}

function urlLoansValid(params) {
  const loanKeys = [];
  Object.keys(params).forEach(function (key) {
    if (key.contains('name')) {
      loanKeys.push(key);
    }
  });

  for (let i = 0; i < loanKeys.length; i++) {
    const id = loanKeys[i].split('_')[1];
    if (
      params['balance_' + id] != null &&
      params['payment_' + id] != null &&
      params['rate_' + id] != null
    ) {
      // valid
    } else {
      return false;
    }
  }
  return true;
}

function loadUrlLoans(params) {
  window.loans = {};
  window.auto_increment = -1;
  window.monthly_payment = 0;
  ApplicationController.monthlyPaymentInputChange();

  window.payment_type = 'avalanche';

  Router.init();
  Router.addMonthlyPaymentListener();
  Router.addCalculateListener();

  Handlebars.registerPartial('row', $('#loan-table-row-partial').html());

  if (urlLoansValid(params)) {
    if (params['monthly_payment']) {
      $('#monthly-payment').val(params['monthly_payment']);
    }

    const loanKeys = [];
    Object.keys(params).forEach(function (key) {
      if (key.contains('name')) {
        loanKeys.push(key);
      }
    });

    for (let i = 0; i < loanKeys.length; i++) {
      const loanId = loanKeys[i].split('_')[1];
      window.auto_increment = loanId;
      const id = loanId;
      const source = $('#loan-input-template').html();
      const template = Handlebars.compile(source);
      const context = { id: id };
      const html = template(context);
      $('#loan-inputs').append(html);
      $('#loan' + id)
        .hide()
        .fadeIn('500');
      window.loans[id] = new Loan(id, 0, 0, 0, 0);
      Router.addLoanDestroyListener(id);
      Router.addLoanInputListeners(id);
      $('#loan-name-' + id).val(unescape(params['name_' + loanId]));
      $('#current-balance-' + id).val(params['balance_' + loanId]);
      $('#minimum-payment-' + id).val(params['payment_' + loanId]);
      $('#interest-rate-' + id).val(params['rate_' + loanId]);

      const event = 'change';
      $('#loan-name-' + id).trigger(event);
      $('#current-balance-' + id).trigger(event);
      $('#minimum-payment-' + id).trigger(event);
      $('#interest-rate-' + id).trigger(event);
    }
  }
}

// Initialize on DOM ready
$().ready(function () {
  const params = getSearchParameters();
  loadUrlLoans(params);
});
