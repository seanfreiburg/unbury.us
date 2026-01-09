// Results Controller - handles loan payoff calculations and display

export const ResultsController = {
  loanResults: { loans: {}, totals: {} },

  results() {
    const results = this.computeResults();
    if (results == null) {
      alert(
        'The loan payoff is more than 122 years, longer than the oldest person ever. You probably need to pay more on the loan or you will never pay it off.'
      );
    } else {
      this.drawTotalResults(results);
      this.drawLoanResults(results);
    }
    return results;
  },

  drawTotalResults(results) {
    const source = $('#total-results-template').html();
    const template = Handlebars.compile(source);
    const html = template(results.totals);
    $('#total-results').empty().append(html);
    $('#total-results').hide().fadeIn('500');
  },

  drawLoanResults(results) {
    const source = $('#loan-results-template').html();
    const template = Handlebars.compile(source);
    const html = template(results);
    $('#loan-results').empty().append(html);
    $('#loan-results').hide().fadeIn('500');
    for (const loanKey in results.loans) {
      window.Router.addLoanTableResultListener(loanKey);
    }
  },

  computeResults() {
    const loansDict = window.loans;
    const loans = [];
    for (const index in loansDict) {
      loans.push(loansDict[index]);
    }
    return this.calculate(loans, window.payment_type, window.monthly_payment);
  },

  calculate(loans, paymentType, monthlyPayment) {
    this.loanResults = { loans: {}, totals: {} };
    const remainingLoans = {};
    const currentPrincipal = {};
    const currentInterest = {};
    const minimumPayments = {};
    let month = dayjs().startOf('month');

    for (const loanKey in loans) {
      this.loanResults.loans[loanKey] = {
        rows: [],
        loan_name: loans[loanKey].loanName,
        total_date: '0',
        total_interest_paid: 0,
        id: loanKey,
        starting_balance: loans[loanKey].currentBalance,
      };
      currentPrincipal[loanKey] = loans[loanKey].currentBalance;
      currentInterest[loanKey] = 0;
      remainingLoans[loanKey] = loans[loanKey];
      this.logDefaultLine(loanKey, month);
      const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
      this.logBalanceRemainingLine(loanKey, currentBalance);
    }

    let counter = 0;
    while (Object.keys(remainingLoans).length > 0) {
      counter++;
      if (counter > 12 * 122) {
        return null;
      }
      month = month.add(1, 'month');
      let extraPayment = monthlyPayment;
      for (const loanKey in remainingLoans) {
        minimumPayments[loanKey] = remainingLoans[loanKey].minimumPayment;
        extraPayment = extraPayment - minimumPayments[loanKey];
        this.logDefaultLine(loanKey, month);
      }
      this.payMinimums(remainingLoans, currentPrincipal, currentInterest, minimumPayments);
      extraPayment = extraPayment + this.addLeftoverPayments(minimumPayments);
      this.removePaidOffLoans(remainingLoans, currentPrincipal, currentInterest, minimumPayments);
      this.applyExtraPayments(
        remainingLoans,
        currentPrincipal,
        currentInterest,
        paymentType,
        extraPayment,
        minimumPayments
      );
      for (const loanKey in remainingLoans) {
        const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
        this.logBalanceRemainingLine(loanKey, currentBalance);
      }
      this.addInterest(remainingLoans, currentPrincipal, currentInterest);
    }

    this.logTotals(month);
    return this.loanResults;
  },

  removePaidOffLoans(remainingLoans, currentPrincipal, currentInterest, minimumPayments) {
    for (const loanKey in remainingLoans) {
      const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
      if (currentBalance == 0) {
        this.removeLoan(remainingLoans, currentPrincipal, currentInterest, minimumPayments, loanKey);
      }
    }
  },

  removeLoan(remainingLoans, currentPrincipal, currentInterest, minimumPayments, loanKey) {
    delete remainingLoans[loanKey];
    delete currentPrincipal[loanKey];
    delete currentInterest[loanKey];
    delete minimumPayments[loanKey];
  },

  payMinimums(remainingLoans, currentPrincipal, currentInterest, minimumPayments) {
    for (const loanKey in remainingLoans) {
      const leftOver = this.applyPayment(
        loanKey,
        minimumPayments[loanKey],
        currentInterest,
        currentPrincipal
      );
      minimumPayments[loanKey] = leftOver;
    }
  },

  applyPayment(id, payment, interestDict, principalDict) {
    if (interestDict[id] > payment) {
      this.logInterestPaidLine(id, payment);
      interestDict[id] = interestDict[id] - payment;
      return 0;
    } else if (interestDict[id] == payment) {
      this.logInterestPaidLine(id, payment);
      interestDict[id] = interestDict[id] - payment;
      return 0;
    } else {
      this.logInterestPaidLine(id, interestDict[id]);
      const remainingPayment = payment - interestDict[id];
      interestDict[id] = 0;
      return this.principalApplyPayment(id, remainingPayment, principalDict);
    }
  },

  principalApplyPayment(id, payment, principalDict) {
    if (principalDict[id] > payment) {
      this.logPrincipalPaidLine(id, payment);
      principalDict[id] = principalDict[id] - payment;
      return 0;
    } else if (principalDict[id] == payment) {
      this.logPrincipalPaidLine(id, payment);
      principalDict[id] = principalDict[id] - payment;
      return 0;
    } else {
      this.logPrincipalPaidLine(id, principalDict[id]);
      const remainingPayment = payment - principalDict[id];
      principalDict[id] = 0;
      return remainingPayment;
    }
  },

  addInterest(remainingLoans, currentPrincipal, currentInterest) {
    for (const loanKey in remainingLoans) {
      const currentBalance = currentPrincipal[loanKey] + currentInterest[loanKey];
      const interestGenerated = currentBalance * (remainingLoans[loanKey].interestRate / 100 / 12);
      currentInterest[loanKey] =
        currentInterest[loanKey] + this.preciseRound(interestGenerated, 2);
    }
  },

  applyExtraPayments(
    remainingLoans,
    currentPrincipal,
    currentInterest,
    paymentType,
    extraPayment,
    minimumPayments
  ) {
    const sortedKeys = this.sortLoans(remainingLoans, currentPrincipal, currentInterest, paymentType);
    for (const key in sortedKeys) {
      if (extraPayment == 0 || Object.keys(remainingLoans).length == 0) {
        return extraPayment;
      }
      extraPayment = this.applyPayment(
        sortedKeys[key],
        extraPayment,
        currentInterest,
        currentPrincipal
      );
      if (currentPrincipal[sortedKeys[key]] + currentInterest[sortedKeys[key]] == 0) {
        this.removeLoan(
          remainingLoans,
          currentPrincipal,
          currentInterest,
          minimumPayments,
          sortedKeys[key]
        );
      }
    }
  },

  addLeftoverPayments(minimumPayments) {
    let leftover = 0;
    for (const key in minimumPayments) {
      leftover += minimumPayments[key];
    }
    return leftover;
  },

  preciseRound(num, decimals) {
    const t = Math.pow(10, decimals);
    return parseFloat(
      (
        Math.round(
          num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))
        ) / t
      ).toFixed(decimals)
    );
  },

  sortLoans(remainingLoans, currentPrincipal, currentInterest, paymentType) {
    if (paymentType == 'snowball') {
      return Object.keys(remainingLoans).sort(function (a, b) {
        return (
          currentInterest[a] + currentPrincipal[a] - (currentInterest[b] + currentPrincipal[b])
        );
      });
    } else if (paymentType == 'avalanche') {
      return Object.keys(remainingLoans).sort(function (a, b) {
        return remainingLoans[b].interestRate - remainingLoans[a].interestRate;
      });
    }
  },

  logDefaultLine(id, date) {
    this.loanResults.loans[id].rows.push({});
    const row = this.loanResults.loans[id].rows[this.loanResults.loans[id].rows.length - 1];
    row['date'] = date.format('MMMM YYYY');
    row['payment'] = 0;
    row['principal_paid'] = 0;
    row['interest_paid'] = 0;
    row['balance_remaining'] = 0;
  },

  logPaymentLine(id, payment) {
    const row = this.loanResults.loans[id].rows[this.loanResults.loans[id].rows.length - 1];
    row['payment'] += this.preciseRound(payment, 2);
    row['payment'] = this.preciseRound(row['payment'], 2);
  },

  logPrincipalPaidLine(id, principalPaid) {
    const row = this.loanResults.loans[id].rows[this.loanResults.loans[id].rows.length - 1];
    row['principal_paid'] = this.preciseRound(row['principal_paid'] + principalPaid, 2);
    this.logPaymentLine(id, principalPaid);
  },

  logInterestPaidLine(id, interestPaid) {
    const row = this.loanResults.loans[id].rows[this.loanResults.loans[id].rows.length - 1];
    row['interest_paid'] = this.preciseRound(row['interest_paid'] + interestPaid, 2);
    this.logPaymentLine(id, interestPaid);
  },

  logBalanceRemainingLine(id, balanceRemaining) {
    const row = this.loanResults.loans[id].rows[this.loanResults.loans[id].rows.length - 1];
    row['balance_remaining'] += this.preciseRound(balanceRemaining, 2);
  },

  logTotals(date) {
    this.loanResults.totals['total_date'] = date.format('MMMM YYYY');
    let totalInterestPaid = 0;
    for (const loanKey in this.loanResults.loans) {
      this.loanResults.loans[loanKey].total_interest_paid = 0;
      for (const lineKey in this.loanResults.loans[loanKey].rows) {
        this.loanResults.loans[loanKey].total_interest_paid +=
          this.loanResults.loans[loanKey].rows[lineKey]['interest_paid'];
      }
      this.loanResults.loans[loanKey].total_interest_paid = this.preciseRound(
        this.loanResults.loans[loanKey].total_interest_paid,
        2
      );
      this.loanResults.loans[loanKey].total_date =
        this.loanResults.loans[loanKey].rows[
          this.loanResults.loans[loanKey].rows.length - 1
        ]['date'];
      totalInterestPaid += this.loanResults.loans[loanKey].total_interest_paid;
    }
    this.loanResults.totals['total_interest_paid'] = this.preciseRound(totalInterestPaid, 2);
  },
};

export default ResultsController;
