// FI Calculator - Main entry point
/* eslint-disable @typescript-eslint/no-explicit-any */


interface FIWindowState {
  current_assets: number;
  savings_rate: number;
  current_salary: number;
  return_rate: number;
  years_of_savings: number;
  inflation_rate: number;
  [key: string]: number;
}

// Polyfills
if (!String.prototype.contains) {
  String.prototype.contains = function (searchString: string): boolean {
    return this.indexOf(searchString) !== -1;
  };
}

Math.sign =
  Math.sign ||
  function sign(x: number): number {
    x = +x;
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };

// Utility functions
function preciseRound(num: number, decimals: number): number {
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
  autoCalculate(): void {
    this.calculate();
  },

  calculate(): void {
    const win = window as unknown as FIWindowState;
    let yearsToFi = 0;
    let assets = win.current_assets;
    const salaryInRetirement = (1 - win.savings_rate / 100) * win.current_salary;

    while (assets < win.years_of_savings * salaryInRetirement) {
      yearsToFi += 1;
      assets += (win.return_rate - win.inflation_rate) * assets;
      assets += win.current_salary * (win.savings_rate / 100);
      if (yearsToFi > 122) {
        $('#years_to_fi').text('You may never reach FI with current savings rate');
        return;
      }
    }
    $('#years_to_fi').text(yearsToFi + ' years to financial independence');
  },

  currentSalaryInputChange(): void {
    this.inputChange('#current_salary');
  },

  savingsRateInputChange(): void {
    this.inputChange('#savings_rate');
  },

  currentAssetsInputChange(): void {
    this.inputChange('#current_assets');
  },

  inputChange(str: string): void {
    const selector = $(str);
    const value = selector.val() as string;
    const numValue = preciseRound(Number(value), 2);
    const win = window as unknown as FIWindowState;
    win[str.substr(1, str.length)] = numValue;
  },
};

// Router
const Router = {
  init(): void {
    this.addCurrentAssetsListener();
    this.addSavingsRateListener();
    this.addCurrentSalaryListener();
    this.addCalculateListener();
  },

  addCurrentSalaryListener(): void {
    $('#current_salary').change(function () {
      ApplicationController.currentSalaryInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addSavingsRateListener(): void {
    $('#savings_rate').change(function () {
      ApplicationController.savingsRateInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addCurrentAssetsListener(): void {
    $('#current_assets').change(function () {
      ApplicationController.currentAssetsInputChange();
      ApplicationController.autoCalculate();
    });
  },

  addCalculateListener(): void {
    $('#calculate').click(function () {
      ApplicationController.calculate();
    });
  },
};

// Initialize
function init(): void {
  const win = window as unknown as FIWindowState;
  win.current_assets = 0;
  win.savings_rate = 0;
  win.current_salary = 0;
  win.return_rate = 0.07;
  win.years_of_savings = 25;
  win.inflation_rate = 0.02;
  Router.init();
}

$().ready(function () {
  init();
});
