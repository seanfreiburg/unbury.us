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

/**
 * This is not my code. The previous person made this a cluster
 * Sean
 */
ResultsController.calculate = function (sortedLoans) {

    var currentMonth = new UDate(),
        calcName = [],
        principal_remaining = [],
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
        sortedLoans[i].total_interest_paid = 0;
        sortedLoans[i].rows = [];
        sortedLoans[i].pay_off_date = new UDate();
        calcName[i] = sortedLoans[i].loanName;
        principal_remaining[i] = sortedLoans[i].currentBalance.toFixed(2);
        calcInterest[i] = (sortedLoans[i].interestRate * 0.01).toFixed(2);
        calcMinPayment[i] = sortedLoans[i].minimumPayment.toFixed(2);
        finishedCalculating[i] = 0;

    }

    while (remainingLoans && possibleCalc) {


        var monthlyPayment = window.monthly_payment;
        var firstPaymentPass = true;
        //Set monthly payments
        for (var h = 0; h < startingLoanCount; h++) {
            if (finishedCalculating[h] == 0) {
                calcInterestPaid[h] = (principal_remaining[h] * (calcInterest[h] / 12));
                calcPrincPaid[h] = 0;
                sortedLoans[h].total_interest_paid += calcInterestPaid[h];
                calcMonthlyPayment[h] = calcMinPayment[h];
                monthlyPayment = monthlyPayment - calcMinPayment[h];
            }
        }
        // Loops to ensure all focus payment is distributed
        while ((monthlyPayment > 0 || firstPaymentPass) && remainingLoans) {
            // Give rollover/focus money to priority loans
            for (var j = 0; j < startingLoanCount; j++) {
                if (monthlyPayment > 0 && principal_remaining[j] > 0) {
                    calcMonthlyPayment[j] += monthlyPayment;
                    monthlyPayment = 0;
                }
            }

            // Payment pass
            for (var k = 0; k < startingLoanCount; k++) {
                if (principal_remaining[k] > 0) {
                    if (calcMonthlyPayment[k] - calcInterestPaid[k] < principal_remaining[k]) {
                        calcPrincPaid[k] = calcMonthlyPayment[k] - calcInterestPaid[k];
                        principal_remaining[k] -= calcPrincPaid[k];
                    }
                    else {
                        calcPrincPaid[k] = principal_remaining[k];
                        monthlyPayment = calcMonthlyPayment[k] - principal_remaining[k] - calcInterestPaid[k];
                        calcMonthlyPayment[k] = principal_remaining[k] + calcInterestPaid[k];
                        principal_remaining[k] = 0;
                        remainingLoans -= 1;
                        sortedLoans[k].pay_off_date.setDate(currentMonth.getYear(), currentMonth.getMonth());
                    }
                }
            }
            firstPaymentPass = false;
        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)

        // Send monthly results to ResultBar
        for (var g = 0; g < startingLoanCount; g++) {
            if (finishedCalculating[g] == 0) {
                if (principal_remaining[g] == 0) {
                    finishedCalculating[g] = 1;
                }
                var month =jQuery.extend(true, {}, currentMonth);
                sortedLoans[g].rows.push({principal_remaining: principal_remaining[g].toFixed(2),principal_paid: calcPrincPaid[g].toFixed(2) ,balance: principal_remaining[g].toFixed(2), payment: Number(calcMonthlyPayment[g]).toFixed(2) , interest_paid: calcInterestPaid[g].toFixed(2), month: month })

            }


        }
        currentMonth.increment();
        iterator++;

        // Check to see current date is < year 2200 to prevent ridiculous calls
        if (currentMonth.getYear() > 2200) {
            console.log("hit");
            possibleCalc = false;
        }

    }// while(remainingLoans)


    if (possibleCalc) {
        for (var n = 0; n < startingLoanCount; n++) {
            sortedLoans[n].total_interest_paid = sortedLoans[n].total_interest_paid.toFixed(2);
        }
        return sortedLoans;

    }
    else {
        console.log("impossible");
        return null;
    }

};

