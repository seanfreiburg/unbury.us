// FI Calculator - Main entry point

// Polyfills
if (!String.prototype.contains) {
  String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
  };
}

Math.sign =
  Math.sign ||
  function sign(x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };

// Utility functions
function preciseRound(num, decimals) {
  const t = Math.pow(10, decimals);
  return parseFloat(
    (
      Math.round(num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) /
      t
    ).toFixed(decimals)
  );
}

// Application Controller
const ApplicationController = {
  autoCalculate() {
    this.calculate();
  },

  calculate() {
    let yearsToFi = 0;
    let assets = window.current_assets;
    const salaryInRetirement = (1 - window.savings_rate / 100) * window.current_salary;

    while (assets < window.years_of_savings * salaryInRetirement) {
      yearsToFi += 1;
      assets += (window.return_rate - window.inflation_rate) * assets;
      assets += window.current_salary * (window.savings_rate / 100);
      if (yearsToFi > 122) {
        $('#years_to_fi').text('You may never reach FI with current savings rate');
        return;
      }
    }
    $('#years_to_fi').text(yearsToFi + ' years to financial independence');
  },

  currentSalaryInputChange() {
    this.inputChange('#current_salary');
  },

  savingsRateInputChange() {
    this.inputChange('#savings_rate');
  },

  currentAssetsInputChange() {
    this.inputChange('#current_assets');
  },

  inputChange(str) {
    const selector = $(str);
    let value = selector.val();
    value = preciseRound(value, 2);
    window[str.substr(1, str.length)] = Number(value);
  },
};

// Router
const Router = {
  init() {
    this.addCurrentAssetsListener();
    this.addSavingsRateListener();
    this.addCurrentSalaryListener();
    this.addCalculateListener();
  },

  addCurrentSalaryListener() {
    $('#current_salary').change(function () {
      ApplicationController.currentSalaryInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addSavingsRateListener() {
    $('#savings_rate').change(function () {
      ApplicationController.savingsRateInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addCurrentAssetsListener() {
    $('#current_assets').change(function () {
      ApplicationController.currentAssetsInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addCalculateListener() {
    $('#calculate').click(function () {
      ApplicationController.calculate();
    });
  },
};

// Initialize
function init() {
  window.current_assets = 0;
  window.savings_rate = 0;
  window.current_salary = 0;
  window.return_rate = 0.07;
  window.years_of_savings = 25;
  window.inflation_rate = 0.02;
  Router.init();
}

$().ready(function () {
  init();
});
