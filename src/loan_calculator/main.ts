// Main entry point for loan calculator
import { Loan } from './loan';
import { Router } from './router';
import { ApplicationController } from './application-controller';

declare const Handlebars: {
  compile: (template: string) => (context: unknown) => string;
  registerPartial: (name: string, partial: string) => void;
};

// Polyfill for String.contains if not present
if (!String.prototype.contains) {
  String.prototype.contains = function (searchString: string): boolean {
    return this.indexOf(searchString) !== -1;
  };
}

// Math.sign polyfill
Math.sign =
  Math.sign ||
  function sign(x: number): number {
    x = +x;
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };

// Make Router available globally for callbacks
(window as Window & { Router: typeof Router }).Router = Router;

// URL parameter parsing
function getSearchParameters(): Record<string, string> {
  const prmstr = window.location.hash;
  return prmstr != null && prmstr != '' ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr: string): Record<string, string> {
  const params: Record<string, string> = {};
  const prmarr = prmstr.substr(1).split('&');
  for (let i = 0; i < prmarr.length; i++) {
    const tmparr = prmarr[i].split('=');
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}

function urlLoansValid(params: Record<string, string>): boolean {
  const loanKeys: string[] = [];
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

function loadUrlLoans(params: Record<string, string>): void {
  (window as Window & { loans: Record<string, Loan> }).loans = {};
  (window as Window & { auto_increment: number }).auto_increment = -1;
  (window as Window & { monthly_payment: number }).monthly_payment = 0;
  ApplicationController.monthlyPaymentInputChange();

  (window as Window & { payment_type: string }).payment_type = 'avalanche';

  Router.init();
  Router.addMonthlyPaymentListener();
  Router.addCalculateListener();

  Handlebars.registerPartial('row', $('#loan-table-row-partial').html());

  if (urlLoansValid(params)) {
    if (params['monthly_payment']) {
      $('#monthly-payment').val(params['monthly_payment']);
    }

    const loanKeys: string[] = [];
    Object.keys(params).forEach(function (key) {
      if (key.contains('name')) {
        loanKeys.push(key);
      }
    });

    for (let i = 0; i < loanKeys.length; i++) {
      const loanId = loanKeys[i].split('_')[1];
      const loanIdNum = parseInt(loanId, 10);
      (window as Window & { auto_increment: number }).auto_increment = loanIdNum;
      const id = loanId;
      const source = $('#loan-input-template').html();
      const template = Handlebars.compile(source);
      const context = { id: id };
      const html = template(context);
      $('#loan-inputs').append(html);
      $('#loan' + id)
        .hide()
        .fadeIn('500');
      (window as Window & { loans: Record<string, Loan> }).loans[id] = new Loan(
        parseInt(id),
        '',
        0,
        0,
        0
      );
      Router.addLoanDestroyListener(parseInt(id));
      Router.addLoanInputListeners(parseInt(id));
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
