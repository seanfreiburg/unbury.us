/**
 * Standalone calculation module for testing
 * Extracted from public/javascripts/loan_calculator/results_controller.js
 */

class Loan {
  constructor(id, loanName, currentBalance, minimumPayment, interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;
  }
}

class Calculator {
  constructor() {
    this.loan_results = { loans: {}, totals: {} };
  }

  precise_round(num, decimals) {
    const t = Math.pow(10, decimals);
    return parseFloat(
      (
        Math.round(
          num * t +
            (decimals > 0 ? 1 : 0) *
              (Math.sign(num) * (10 / Math.pow(100, decimals)))
        ) / t
      ).toFixed(decimals)
    );
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  sort_loans(remaining_loans, current_principal, current_interest, payment_type) {
    if (payment_type === 'snowball') {
      return Object.keys(remaining_loans).sort((a, b) => {
        return (
          current_interest[a] +
          current_principal[a] -
          (current_interest[b] + current_principal[b])
        );
      });
    } else if (payment_type === 'avalanche') {
      return Object.keys(remaining_loans).sort((a, b) => {
        return remaining_loans[b].interestRate - remaining_loans[a].interestRate;
      });
    }
    return Object.keys(remaining_loans);
  }

  add_interest(remaining_loans, current_principal, current_interest) {
    for (const loan_key in remaining_loans) {
      const current_balance = current_principal[loan_key] + current_interest[loan_key];
      const interest_generated =
        current_balance * (remaining_loans[loan_key].interestRate / 100 / 12);
      current_interest[loan_key] =
        current_interest[loan_key] + this.precise_round(interest_generated, 2);
    }
  }

  apply_payment(id, payment, interest_dict, principal_dict) {
    if (interest_dict[id] > payment) {
      interest_dict[id] = interest_dict[id] - payment;
      return 0;
    } else if (interest_dict[id] === payment) {
      interest_dict[id] = interest_dict[id] - payment;
      return 0;
    } else {
      const remaining_payment = payment - interest_dict[id];
      interest_dict[id] = 0;
      return this.principal_apply_payment(id, remaining_payment, principal_dict);
    }
  }

  principal_apply_payment(id, payment, principal_dict) {
    if (principal_dict[id] > payment) {
      principal_dict[id] = principal_dict[id] - payment;
      return 0;
    } else if (principal_dict[id] === payment) {
      principal_dict[id] = principal_dict[id] - payment;
      return 0;
    } else {
      const remaining_payment = payment - principal_dict[id];
      principal_dict[id] = 0;
      return remaining_payment;
    }
  }

  pay_minimums(remaining_loans, current_principal, current_interest, minimum_payments) {
    for (const loan_key in remaining_loans) {
      const left_over = this.apply_payment(
        loan_key,
        minimum_payments[loan_key],
        current_interest,
        current_principal
      );
      minimum_payments[loan_key] = left_over;
    }
  }

  add_leftover_payments(minimum_payments) {
    let leftover = 0;
    for (const key in minimum_payments) {
      leftover += minimum_payments[key];
    }
    return leftover;
  }

  remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, loan_key) {
    delete remaining_loans[loan_key];
    delete current_principal[loan_key];
    delete current_interest[loan_key];
    delete minimum_payments[loan_key];
  }

  remove_paid_off_loans(remaining_loans, current_principal, current_interest, minimum_payments) {
    const keys_to_remove = [];
    for (const loan_key in remaining_loans) {
      const current_balance = current_principal[loan_key] + current_interest[loan_key];
      if (current_balance === 0) {
        keys_to_remove.push(loan_key);
      }
    }
    for (const loan_key of keys_to_remove) {
      this.remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, loan_key);
    }
  }

  apply_extra_payments(remaining_loans, current_principal, current_interest, payment_type, extra_payment, minimum_payments) {
    const sorted_keys = this.sort_loans(remaining_loans, current_principal, current_interest, payment_type);
    for (const key of sorted_keys) {
      if (extra_payment === 0 || Object.keys(remaining_loans).length === 0) {
        return extra_payment;
      }
      extra_payment = this.apply_payment(key, extra_payment, current_interest, current_principal);
      if (current_principal[key] + current_interest[key] === 0) {
        this.remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, key);
      }
    }
    return extra_payment;
  }

  /**
   * Main calculation function
   * @param {Object[]} loans - Array of Loan objects
   * @param {string} payment_type - 'avalanche' or 'snowball'
   * @param {number} monthly_payment - Total monthly payment amount
   * @returns {Object|null} - Results object or null if payoff > 122 years
   */
  calculate(loans, payment_type, monthly_payment) {
    this.loan_results = { loans: {}, totals: {} };
    const remaining_loans = {};
    const current_principal = {};
    const current_interest = {};
    const minimum_payments = {};
    let month_count = 0;

    // Initialize
    for (let i = 0; i < loans.length; i++) {
      const loan_key = String(i);
      this.loan_results.loans[loan_key] = {
        rows: [],
        loan_name: loans[i].loanName,
        total_date: '0',
        total_interest_paid: 0,
        id: loan_key,
        starting_balance: loans[i].currentBalance
      };
      current_principal[loan_key] = loans[i].currentBalance;
      current_interest[loan_key] = 0;
      remaining_loans[loan_key] = loans[i];

      // Log initial state
      this.loan_results.loans[loan_key].rows.push({
        month: 0,
        payment: 0,
        principal_paid: 0,
        interest_paid: 0,
        balance_remaining: current_principal[loan_key]
      });
    }

    // Main loop
    while (Object.keys(remaining_loans).length > 0) {
      month_count++;
      if (month_count > 12 * 122) {
        return null; // Payoff too long
      }

      let extra_payment = monthly_payment;

      // Calculate minimum payments and extra
      for (const loan_key in remaining_loans) {
        minimum_payments[loan_key] = remaining_loans[loan_key].minimumPayment;
        extra_payment = extra_payment - minimum_payments[loan_key];
      }

      // Pay minimums
      this.pay_minimums(remaining_loans, current_principal, current_interest, minimum_payments);
      extra_payment = extra_payment + this.add_leftover_payments(minimum_payments);

      // Remove paid off loans
      this.remove_paid_off_loans(remaining_loans, current_principal, current_interest, minimum_payments);

      // Apply extra payments
      this.apply_extra_payments(
        remaining_loans,
        current_principal,
        current_interest,
        payment_type,
        extra_payment,
        minimum_payments
      );

      // Log current state for each remaining loan
      for (const loan_key in remaining_loans) {
        const current_balance = current_principal[loan_key] + current_interest[loan_key];
        this.loan_results.loans[loan_key].rows.push({
          month: month_count,
          balance_remaining: this.precise_round(current_balance, 2)
        });
      }

      // Add interest for next month
      this.add_interest(remaining_loans, current_principal, current_interest);
    }

    // Calculate totals
    let total_interest_paid = 0;
    for (const loan_key in this.loan_results.loans) {
      const loan_result = this.loan_results.loans[loan_key];
      const starting = loan_result.starting_balance;
      let total_paid = 0;

      // Sum up all payments
      for (const row of loan_result.rows) {
        total_paid += row.payment || 0;
      }

      loan_result.total_interest_paid = this.precise_round(
        loan_result.rows.reduce((acc, row) => acc + (row.interest_paid || 0), 0),
        2
      );
      total_interest_paid += loan_result.total_interest_paid;
    }

    this.loan_results.totals.total_months = month_count;
    this.loan_results.totals.total_interest_paid = this.precise_round(total_interest_paid, 2);

    return this.loan_results;
  }
}

export { Loan, Calculator };
