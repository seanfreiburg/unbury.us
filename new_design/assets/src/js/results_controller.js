var ResultsController = function () {

};


ResultsController.results = function () {
    var results = ResultsController.compute_results();
    ResultsController.draw_total_results(results);
    ResultsController.draw_loan_results(results);
};


ResultsController.draw_total_results = function (results) {
    var source = $("#total-results-template").html();
    var template = Handlebars.compile(source);
    var html = template(results);
    $("#total-results").empty().append(html);
    $("#total-results").hide().fadeIn('500');
};

ResultsController.draw_loan_results = function (results) {
    var source = $("#loan-results-template").html();
    var template = Handlebars.compile(source);
    var html = template(results);
    $("#loan-results").empty().append(html);
    $("#loan-results").hide().fadeIn('500');
    for (var i = 0; i < results.loans.length; i++) {
        Router.add_loan_table_result_listener(results.loans[i].id);
    }
};


ResultsController.compute_results = function () {
    /*return {year: 2016, total_interest: 20.23, loans: [{id: 1, loan_name: "fg",year: 2016, total_interest: 20.23,
     rows: [{month: "January", year: 2014,payment: 20, principal_paid: 17, interest_paid: 3, principal: 340,
     total_interest: 23 }] }]};*/

    var loans_dict = window.loans;
    var loans = [];
    for (var index in loans_dict) {
        loans.push(loans_dict[index]);
    }
    if (window.payment_type == "avalanche") {
        loans.sort(function (a, b) {
            return b.get_interest_rate() - a.get_interest_rate();
        });
    }
    else {
        loans.sort(function (a, b) {
            return a.currentBalance - b.currentBalance;
        });
    }



    return ResultsController.calculate(loans);

};


/**
 * Calculates all current values -- does a brunt of the work
 * TODO This is a nightmare and needs cleaned up
 * @param {number[]} sortedLoans An array of the UID of loans
 */
ResultsController.calculate = function (sortedLoans) {

    var currentMonth = new UDate(),
        calcName = [],
        calcBalance = [],
        calcInterest = [],
        calcMinPayment = [],
        calcInterestPaid = [],
        calcPrincPaid = [],
        calcMonthlyPayment = [],
        finishedCalculating = [],
        remainingLoans = sortedLoans.length,
        startingLoanCount = sortedLoans.length,
        iterator = 0,
        possibleCalc = true;

    // Initialize and draw
    for (var i = 0; i < startingLoanCount; i++) {
        sortedLoans[i].results = {};
        sortedLoans[i].results.totalInterestPaid = 0;
        calcName[i] = sortedLoans[i].get_loan_name;
        calcBalance[i] = sortedLoans[i].get_current_balance;
        calcInterest[i] = sortedLoans[i].get_interest_rate() * 0.01;
        calcMinPayment[i] = sortedLoans[i].get_minimum_payment();
        finishedCalculating[i] = 0;
    }

    while (remainingLoans && possibleCalc) {
        var focusPayment = window.monthly_payment;
        var firstPaymentPass = true;
        //Set monthly payments
        for (var i = 0; i < startingLoanCount; i++) {
            if (finishedCalculating[i] == 0) {
                calcInterestPaid[i] = (calcBalance[i] * (calcInterest[i] / 12));
                calcPrincPaid[i] = 0;
                sortedLoans[i].results.totalInterestPaid += calcInterestPaid[i];
                calcMonthlyPayment[i] = calcMinPayment[i];
                focusPayment = focusPayment - calcMinPayment[i];
            }
        }
        // Loops to ensure all focus payment is distributed
        while ((focusPayment > 0 || firstPaymentPass) && remainingLoans) {
            // Give rollover/focus money to priority loans
            for (var i = 0; i < startingLoanCount; i++) {
                if (focusPayment > 0 && calcBalance[i] > 0) {
                    calcMonthlyPayment[i] += focusPayment;
                    focusPayment = 0;
                }
            }

            // Payment pass
            for (var i = 0; i < startingLoanCount; i++) {
                if (calcBalance[i] > 0) {
                    if (calcMonthlyPayment[i] - calcInterestPaid[i] < calcBalance[i]) {
                        calcPrincPaid[i] = calcMonthlyPayment[i] - calcInterestPaid[i];
                        calcBalance[i] -= calcPrincPaid[i];
                    }
                    else {
                        calcPrincPaid[i] = calcBalance[i];
                        focusPayment = calcMonthlyPayment[i] - calcBalance[i] - calcInterestPaid[i];
                        calcMonthlyPayment[i] = calcBalance[i] + calcInterestPaid[i];
                        calcBalance[i] = 0;
                        remainingLoans -= 1;
                        sortedLoans[i].results.payOffDate.setDate(currentMonth.getYear(), currentMonth.getMonth());
                    }
                }
            }
            firstPaymentPass = false;
        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)

        // Send monthly results to ResultBar
        for (var i = 0; i < startingLoanCount; i++) {
            if (finishedCalculating[i] == 0) {
                if (calcBalance[i] == 0)
                    finishedCalculating[i] = 1;

            }
        }
        currentMonth.increment();
        iterator++;

        // Check to see current date is < year 2200 to prevent ridiculous calls
        if (currentMonth.getYear() > 2200)
            console.log("hit");
            possibleCalc = false;
    }// while(remainingLoans)


    if (possibleCalc) {
      return sortedLoans;

    }
    else {
        console.log("impossible");
        return null;
    }

};

