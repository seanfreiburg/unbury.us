const { Loan, Calculator } = require('./calculator');

describe('Loan Class', () => {
  test('creates loan with correct properties', () => {
    const loan = new Loan(0, 'Student Loan', 10000, 200, 5.5);
    expect(loan.id).toBe(0);
    expect(loan.loanName).toBe('Student Loan');
    expect(loan.currentBalance).toBe(10000);
    expect(loan.minimumPayment).toBe(200);
    expect(loan.interestRate).toBe(5.5);
  });
});

describe('Calculator - Utility Functions', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('precise_round', () => {
    test('rounds to 2 decimal places correctly', () => {
      expect(calc.precise_round(10.126, 2)).toBe(10.13);
      expect(calc.precise_round(10.124, 2)).toBe(10.12);
      expect(calc.precise_round(10.125, 2)).toBe(10.13);
    });

    test('handles zero decimals', () => {
      expect(calc.precise_round(10.6, 0)).toBe(11);
      expect(calc.precise_round(10.4, 0)).toBe(10);
    });

    test('handles negative numbers', () => {
      expect(calc.precise_round(-10.126, 2)).toBe(-10.13);
    });
  });

  describe('arraysEqual', () => {
    test('returns true for equal arrays', () => {
      expect(calc.arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(calc.arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    test('returns false for different arrays', () => {
      expect(calc.arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(calc.arraysEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    test('handles null/undefined', () => {
      expect(calc.arraysEqual(null, [1])).toBe(false);
      expect(calc.arraysEqual([1], null)).toBe(false);
    });

    test('handles same reference', () => {
      const arr = [1, 2, 3];
      expect(calc.arraysEqual(arr, arr)).toBe(true);
    });
  });
});

describe('Calculator - Sorting Functions', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('sort_loans - snowball method', () => {
    test('sorts by lowest total balance first', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan A', 5000, 100, 6),
        '1': new Loan(1, 'Loan B', 2000, 50, 5),
        '2': new Loan(2, 'Loan C', 8000, 150, 7)
      };
      const current_principal = { '0': 5000, '1': 2000, '2': 8000 };
      const current_interest = { '0': 0, '1': 0, '2': 0 };

      const sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'snowball');
      expect(sorted).toEqual(['1', '0', '2']); // 2000, 5000, 8000
    });

    test('includes accumulated interest in balance', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan A', 5000, 100, 6),
        '1': new Loan(1, 'Loan B', 2000, 50, 5)
      };
      const current_principal = { '0': 5000, '1': 2000 };
      const current_interest = { '0': 100, '1': 4000 }; // Loan 1 now has 6000 total

      const sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'snowball');
      expect(sorted).toEqual(['0', '1']); // 5100 < 6000
    });
  });

  describe('sort_loans - avalanche method', () => {
    test('sorts by highest interest rate first', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan A', 5000, 100, 6),
        '1': new Loan(1, 'Loan B', 2000, 50, 9),
        '2': new Loan(2, 'Loan C', 8000, 150, 4)
      };
      const current_principal = { '0': 5000, '1': 2000, '2': 8000 };
      const current_interest = { '0': 0, '1': 0, '2': 0 };

      const sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'avalanche');
      expect(sorted).toEqual(['1', '0', '2']); // 9%, 6%, 4%
    });
  });
});

describe('Calculator - Interest Calculations', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('add_interest', () => {
    test('calculates monthly interest correctly', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan', 1200, 100, 12) // 12% annual = 1% monthly
      };
      const current_principal = { '0': 1200 };
      const current_interest = { '0': 0 };

      calc.add_interest(remaining_loans, current_principal, current_interest);

      // 1200 * (12/100/12) = 1200 * 0.01 = 12
      expect(current_interest['0']).toBe(12);
    });

    test('compounds interest on existing interest', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan', 1000, 100, 12)
      };
      const current_principal = { '0': 1000 };
      const current_interest = { '0': 200 }; // Already has interest

      calc.add_interest(remaining_loans, current_principal, current_interest);

      // (1000 + 200) * 0.01 = 12
      expect(current_interest['0']).toBe(212);
    });

    test('handles 0% interest rate', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan', 1000, 100, 0)
      };
      const current_principal = { '0': 1000 };
      const current_interest = { '0': 0 };

      calc.add_interest(remaining_loans, current_principal, current_interest);

      expect(current_interest['0']).toBe(0);
    });

    test('handles multiple loans', () => {
      const remaining_loans = {
        '0': new Loan(0, 'Loan A', 1000, 100, 12),
        '1': new Loan(1, 'Loan B', 2000, 200, 6)
      };
      const current_principal = { '0': 1000, '1': 2000 };
      const current_interest = { '0': 0, '1': 0 };

      calc.add_interest(remaining_loans, current_principal, current_interest);

      expect(current_interest['0']).toBe(10); // 1000 * 0.01
      expect(current_interest['1']).toBe(10); // 2000 * 0.005
    });
  });
});

describe('Calculator - Payment Application', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('apply_payment', () => {
    test('applies payment to interest first', () => {
      const interest_dict = { '0': 50 };
      const principal_dict = { '0': 1000 };

      const leftover = calc.apply_payment('0', 30, interest_dict, principal_dict);

      expect(interest_dict['0']).toBe(20); // 50 - 30
      expect(principal_dict['0']).toBe(1000); // unchanged
      expect(leftover).toBe(0);
    });

    test('applies remaining to principal after interest', () => {
      const interest_dict = { '0': 20 };
      const principal_dict = { '0': 1000 };

      const leftover = calc.apply_payment('0', 50, interest_dict, principal_dict);

      expect(interest_dict['0']).toBe(0);
      expect(principal_dict['0']).toBe(970); // 1000 - 30
      expect(leftover).toBe(0);
    });

    test('returns leftover if payment exceeds balance', () => {
      const interest_dict = { '0': 10 };
      const principal_dict = { '0': 30 };

      const leftover = calc.apply_payment('0', 50, interest_dict, principal_dict);

      expect(interest_dict['0']).toBe(0);
      expect(principal_dict['0']).toBe(0);
      expect(leftover).toBe(10); // 50 - 10 - 30
    });
  });

  describe('pay_minimums', () => {
    test('pays minimum on each loan', () => {
      const remaining_loans = {
        '0': new Loan(0, 'A', 1000, 100, 5),
        '1': new Loan(1, 'B', 2000, 200, 6)
      };
      const current_principal = { '0': 1000, '1': 2000 };
      const current_interest = { '0': 20, '1': 50 };
      const minimum_payments = { '0': 100, '1': 200 };

      calc.pay_minimums(remaining_loans, current_principal, current_interest, minimum_payments);

      // Loan 0: pays 20 interest, 80 principal
      expect(current_interest['0']).toBe(0);
      expect(current_principal['0']).toBe(920);
      expect(minimum_payments['0']).toBe(0);

      // Loan 1: pays 50 interest, 150 principal
      expect(current_interest['1']).toBe(0);
      expect(current_principal['1']).toBe(1850);
      expect(minimum_payments['1']).toBe(0);
    });
  });
});

describe('Calculator - Full Calculation', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('calculates simple single loan payoff', () => {
    const loans = [new Loan(0, 'Simple Loan', 1000, 100, 0)]; // 0% interest
    const results = calc.calculate(loans, 'avalanche', 100);

    expect(results).not.toBeNull();
    expect(results.totals.total_months).toBe(10); // 1000 / 100
    expect(results.totals.total_interest_paid).toBe(0);
  });

  test('returns null for loans that take > 122 years', () => {
    const loans = [new Loan(0, 'Huge Loan', 1000000, 10, 20)]; // Huge balance, tiny payment, high interest
    const results = calc.calculate(loans, 'avalanche', 10);

    expect(results).toBeNull();
  });

  test('avalanche pays high interest loans first', () => {
    // Two loans with same balance but different rates
    const loans = [
      new Loan(0, 'Low Rate', 1000, 50, 5),
      new Loan(1, 'High Rate', 1000, 50, 15)
    ];

    // Monthly payment of 200 means 100 extra after minimums
    const results = calc.calculate(loans, 'avalanche', 200);

    expect(results).not.toBeNull();
    // High rate loan (index 1) should be paid off first
    const loan0rows = results.loans['0'].rows;
    const loan1rows = results.loans['1'].rows;

    // Loan 1 should have fewer months
    expect(loan1rows.length).toBeLessThan(loan0rows.length);
  });

  test('snowball pays lowest balance loans first', () => {
    const loans = [
      new Loan(0, 'Big Loan', 5000, 100, 5),
      new Loan(1, 'Small Loan', 500, 50, 15)
    ];

    const results = calc.calculate(loans, 'snowball', 300);

    expect(results).not.toBeNull();
    // Small loan should be paid off first despite higher interest
    const loan0rows = results.loans['0'].rows;
    const loan1rows = results.loans['1'].rows;

    expect(loan1rows.length).toBeLessThan(loan0rows.length);
  });

  test('handles loans with different minimum payments', () => {
    const loans = [
      new Loan(0, 'Loan A', 2000, 100, 6),
      new Loan(1, 'Loan B', 3000, 200, 6)
    ];

    const results = calc.calculate(loans, 'avalanche', 400);

    expect(results).not.toBeNull();
    expect(results.totals.total_months).toBeGreaterThan(0);
  });

  test('calculates interest paid correctly', () => {
    const loans = [new Loan(0, 'Test Loan', 1200, 100, 12)]; // 1% monthly
    const results = calc.calculate(loans, 'avalanche', 100);

    expect(results).not.toBeNull();
    // Loan should take multiple months to pay off
    expect(results.totals.total_months).toBeGreaterThan(10);
  });
});

describe('Calculator - Edge Cases', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('handles payment equal to minimum payments', () => {
    const loans = [
      new Loan(0, 'A', 1000, 100, 0),
      new Loan(1, 'B', 1000, 100, 0)
    ];

    // Payment exactly equals sum of minimums
    const results = calc.calculate(loans, 'avalanche', 200);

    expect(results).not.toBeNull();
    expect(results.totals.total_months).toBe(10);
  });

  test('handles single loan', () => {
    const loans = [new Loan(0, 'Single', 500, 50, 6)];
    const results = calc.calculate(loans, 'avalanche', 100);

    expect(results).not.toBeNull();
    expect(Object.keys(results.loans)).toHaveLength(1);
  });

  test('handles many loans', () => {
    const loans = [];
    for (let i = 0; i < 10; i++) {
      loans.push(new Loan(i, `Loan ${i}`, 1000, 50, 5 + i));
    }

    const results = calc.calculate(loans, 'avalanche', 1000);

    expect(results).not.toBeNull();
    expect(Object.keys(results.loans)).toHaveLength(10);
  });

  test('handles loan with 0 balance', () => {
    const loans = [new Loan(0, 'Zero Balance', 0, 100, 5)];
    const results = calc.calculate(loans, 'avalanche', 100);

    expect(results).not.toBeNull();
    // Should complete very quickly (0 or 1 months)
    expect(results.totals.total_months).toBeLessThanOrEqual(1);
  });
});

describe('Original QUnit Test Cases - Ported', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('apply payment test - interest higher than payment', () => {
    const interest_dict = { '0': 30 };
    const principal_dict = { '0': 30 };

    calc.apply_payment('0', 25, interest_dict, principal_dict);

    expect(interest_dict['0']).toBe(5);
  });

  test('apply payment test - payment exceeds interest', () => {
    const interest_dict = { '0': 30 };
    const principal_dict = { '0': 30 };

    calc.apply_payment('0', 35, interest_dict, principal_dict);

    expect(principal_dict['0']).toBe(25);
  });

  test('add interest test 1 - standard case', () => {
    const remaining_loans = { '0': new Loan(0, 'asd', 30, 5, 5) };
    const principal_dict = { '0': 30 };
    const interest_dict = { '0': 30 };

    calc.add_interest(remaining_loans, principal_dict, interest_dict);

    // (30 + 30) * (5/100/12) = 60 * 0.004166... = 0.25
    expect(interest_dict['0']).toBeCloseTo(30.25, 2);
  });

  test('add interest test 2 - no existing interest', () => {
    const remaining_loans = { '0': new Loan(0, 'asd', 30, 5, 5) };
    const principal_dict = { '0': 30 };
    const interest_dict = { '0': 0 };

    calc.add_interest(remaining_loans, principal_dict, interest_dict);

    // 30 * (5/100/12) = 30 * 0.004166... = 0.125 -> rounds to 0.13
    expect(interest_dict['0']).toBeCloseTo(0.13, 2);
  });

  test('add interest test 3 - multiple loans', () => {
    const remaining_loans = {
      '0': new Loan(0, 'asd', 30, 5, 5),
      '1': new Loan(1, 'asd', 30, 5, 5),
      '2': new Loan(2, 'asd', 30, 5, 0)
    };
    const principal_dict = { '0': 30, '1': 30, '2': 30 };
    const interest_dict = { '0': 0, '1': 30, '2': 0 };

    calc.add_interest(remaining_loans, principal_dict, interest_dict);

    expect(interest_dict['0']).toBeCloseTo(0.13, 2);
    expect(interest_dict['1']).toBeCloseTo(30.25, 2);
    expect(interest_dict['2']).toBe(0);
  });

  test('sort loan test 1 - snowball vs avalanche', () => {
    const remaining_loans = {
      '0': new Loan(0, 'asd', 30, 5, 6),
      '1': new Loan(1, 'asd', 30, 5, 5)
    };
    const current_principal = { '0': 30, '1': 0 };
    const current_interest = { '0': 30, '1': 20 };

    // Snowball: sort by total balance (principal + interest)
    // Loan 0: 30 + 30 = 60, Loan 1: 0 + 20 = 20
    const snowball_sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'snowball');
    expect(calc.arraysEqual(snowball_sorted, ['1', '0'])).toBe(true);

    // Avalanche: sort by interest rate (highest first)
    // Loan 0: 6%, Loan 1: 5%
    const avalanche_sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'avalanche');
    expect(calc.arraysEqual(avalanche_sorted, ['0', '1'])).toBe(true);
  });

  test('sort loan test 2 - similar rates', () => {
    const remaining_loans = {
      '0': new Loan(0, 'asd', 30, 5, 5.1),
      '1': new Loan(1, 'asd', 30, 5, 5.7)
    };
    const current_principal = { '0': 30, '1': 0 };
    const current_interest = { '0': 30, '1': 20 };

    // Snowball: Loan 1 has lower balance (20 vs 60)
    const snowball_sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'snowball');
    expect(calc.arraysEqual(snowball_sorted, ['1', '0'])).toBe(true);

    // Avalanche: Loan 1 has higher rate (5.7 vs 5.1)
    const avalanche_sorted = calc.sort_loans(remaining_loans, current_principal, current_interest, 'avalanche');
    expect(calc.arraysEqual(avalanche_sorted, ['1', '0'])).toBe(true);
  });
});
