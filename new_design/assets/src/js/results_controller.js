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
    console.log(results);
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
ResultsController.calculate1 = function (sortedLoans) {

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
        console.log(monthlyPayment);
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
                var date = jQuery.extend(true, {}, currentMonth);
                sortedLoans[k].rows.push({principal_remaining: principal_remaining[k].toFixed(2), principal_paid: calcPrincPaid[k].toFixed(2), balance: principal_remaining[k].toFixed(2), payment: Number(calcMonthlyPayment[k]).toFixed(2), interest_paid: calcInterestPaid[k].toFixed(2), date: date.print(), total_interest: Number(calcInterest[k]).toFixed(2) });
            }
            firstPaymentPass = false;

        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)

        // Send monthly results to ResultBar
        for (var g = 0; g < startingLoanCount; g++) {
            if (finishedCalculating[g] == 0) {
                if (principal_remaining[g] == 0) {
                    finishedCalculating[g] = 1;
                }

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
        var total_interest_paid = 0;
        for (var n = 0; n < startingLoanCount; n++) {
            total_interest_paid += sortedLoans[n].total_interest_paid;
            sortedLoans[n].total_interest_paid = sortedLoans[n].total_interest_paid.toFixed(2);
        }
        return {loans: sortedLoans, total_interest: total_interest_paid.toFixed(2), year: currentMonth.print() };

    }
    else {
        console.log("impossible");
        return null;
    }

};


ResultsController.calculate = function (sortedLoans) {

    var current_month = new UDate(),
        principal_remaining_array = [],
        interest_rate_array = [],
        minimum_payment_array = [],
        interest_paid_array = [],
        principal_paid_array = [],
        monthly_payment_array = [],
        finished_loans_array = [],
        num_remaining_loans = sortedLoans.length,
        starting_loan_count = sortedLoans.length,
        possible_calculation = true;

    // Initialize and draw
    for (var i = 0; i < starting_loan_count; i++) {
        sortedLoans[i].total_interest_paid = 0;
        sortedLoans[i].rows = [];
        principal_remaining_array[i] = sortedLoans[i].currentBalance;
        interest_rate_array[i] = (sortedLoans[i].interestRate * 0.01);
        minimum_payment_array[i] = sortedLoans[i].minimumPayment;
        finished_loans_array[i] = 0;

    }

    while ((num_remaining_loans != 0) && possible_calculation) {

        var monthlyPayment = window.monthly_payment;
        var firstPaymentPass = true;
        //Set monthly payments
        for (var h = 0; h < starting_loan_count; h++) {
            if (finished_loans_array[h] == 0) {
                interest_paid_array[h] = (principal_remaining_array[h] * (interest_rate_array[h] / 12));
                principal_paid_array[h] = 0;
                sortedLoans[h].total_interest_paid += interest_paid_array[h];
                monthly_payment_array[h] = minimum_payment_array[h];
                monthlyPayment = monthlyPayment - minimum_payment_array[h];
            }
        }
        // Loops to ensure all focus payment is distributed
        while ((monthlyPayment > 0 || firstPaymentPass) && num_remaining_loans) {
            // Give rollover/focus money to priority loans
            for (var j = 0; j < starting_loan_count; j++) {
                if (monthlyPayment > 0 && principal_remaining_array[j] > 0) {
                    monthly_payment_array[j] += monthlyPayment;
                    monthlyPayment = 0;
                }
            }

            // Payment pass
            for (var k = 0; k < starting_loan_count; k++) {
                if (principal_remaining_array[k] > 0) {
                    if (monthly_payment_array[k] - interest_paid_array[k] < principal_remaining_array[k]) {
                        principal_paid_array[k] = monthly_payment_array[k] - interest_paid_array[k];
                        principal_remaining_array[k] -= principal_paid_array[k];
                    }
                    else {
                        principal_paid_array[k] = principal_remaining_array[k];
                        monthlyPayment = monthly_payment_array[k] - principal_remaining_array[k] - interest_paid_array[k];
                        monthly_payment_array[k] = principal_remaining_array[k] + interest_paid_array[k];
                        principal_remaining_array[k] = 0;
                        num_remaining_loans -= 1;
                        sortedLoans[k].rows.push({principal_remaining: principal_remaining_array[k].toFixed(2), principal_paid: principal_paid_array[k].toFixed(2), balance: principal_remaining_array[k].toFixed(2), payment: Number(monthly_payment_array[k]).toFixed(2), interest_paid: interest_paid_array[k].toFixed(2), date: current_month.print() });
                    }
                }
                if (principal_remaining_array[k] > 0) {
                    sortedLoans[k].rows.push({principal_remaining: principal_remaining_array[k].toFixed(2), principal_paid: principal_paid_array[k].toFixed(2), balance: principal_remaining_array[k].toFixed(2), payment: Number(monthly_payment_array[k]).toFixed(2), interest_paid: interest_paid_array[k].toFixed(2), date: current_month.print() });
                }
            }
            firstPaymentPass = false;

        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)

        // Send monthly results to ResultBar
        for (var g = 0; g < starting_loan_count; g++) {
            if (finished_loans_array[g] == 0) {
                if (principal_remaining_array[g] == 0) {
                    finished_loans_array[g] = 1;
                    sortedLoans[g].date = jQuery.extend(true, {}, current_month).print();
                }

            }


        }
        current_month.increment();

        // Check to see current date is < year 2200 to prevent ridiculous calls
        if (current_month.getYear() > 2200) {
            console.log("hit");
            possible_calculation = false;
        }

    }// while(remainingLoans)


    if (possible_calculation) {
        var total_interest_paid = 0;
        for (var n = 0; n < starting_loan_count; n++) {
            total_interest_paid += sortedLoans[n].total_interest_paid;
            sortedLoans[n].total_interest_paid = sortedLoans[n].total_interest_paid.toFixed(2);
        }
        current_month.decrement();
        return {loans: sortedLoans, total_interest: total_interest_paid.toFixed(2), year: current_month.print() };

    }
    else {
        console.log("impossible");
        return null;
    }

};



