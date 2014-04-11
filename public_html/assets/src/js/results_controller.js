var ResultsController = function () {

};


ResultsController.results = function () {
    var results = ResultsController.compute_results();
    if (results == null) {
        alert("You will never pay off this loan! Please try again!");
    }
    else {
        ResultsController.draw_total_results(results);
        ResultsController.draw_loan_results(results);
    }
    return results;
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

    var loans_dict = window.loans;

    var loans = [];
    for (var index in loans_dict) {
        loans.push(loans_dict[index]);
    }
    if (window.payment_type == "avalanche") {
        loans.sort(function (a, b) {
            return b.interestRate - a.interestRate;
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
        sortedLoans[i].rows.push({principal_remaining: principal_remaining_array[i].toFixed(2), principal_paid: 0, balance: principal_remaining_array[i].toFixed(2), payment: 0, interest_paid: 0, date: current_month.print() });

    }

    while ((num_remaining_loans != 0) && possible_calculation) {
        current_month.increment();
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

            }
            firstPaymentPass = false;


        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)


        for (var k = 0; k < starting_loan_count; k++) {
            if (principal_remaining_array[k] > 0) {
                console.log(current_month.print());
                sortedLoans[k].rows.push({principal_remaining: principal_remaining_array[k].toFixed(2), principal_paid: principal_paid_array[k].toFixed(2), balance: principal_remaining_array[k].toFixed(2), payment: Number(monthly_payment_array[k]).toFixed(2), interest_paid: interest_paid_array[k].toFixed(2), date: current_month.print() });
            }

        }
        for (var g = 0; g < starting_loan_count; g++) {
            if (finished_loans_array[g] == 0) {
                if (principal_remaining_array[g] == 0) {
                    finished_loans_array[g] = 1;
                    sortedLoans[g].date = current_month.print();
                }

            }


        }


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

        return {loans: sortedLoans, total_interest: total_interest_paid.toFixed(2), year: current_month.print() };


    }
    else {
        console.log("impossible");
        return null;
    }

};



