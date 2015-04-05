var ResultsController = function () {

};


ResultsController.results = function () {
    var results = ResultsController.compute_results();
    if (results == null) {
        alert("The loan payoff is more than 122 years, longer than the oldest person ever. You probably need to pay more on the loan or you will never pay it off.");
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
    var html = template(results.totals);
    $("#total-results").empty().append(html);
    $("#total-results").hide().fadeIn('500');
};

ResultsController.draw_loan_results = function (results) {
    var source = $("#loan-results-template").html();
    var template = Handlebars.compile(source);
    var html = template(results);
    $("#loan-results").empty().append(html);
    $("#loan-results").hide().fadeIn('500');
    for (var loan_key in results.loans) {
        console.log(loan_key);
        Router.add_loan_table_result_listener(loan_key);
    }
};


/*
 Loan step by step

 Generate interest
 Pay min payment
 *Pay interest
 *Pay principal
 If leftover money, add to extra_payment
 Remove loans at 0
 Apply extra payment to loans until extra payment is 0 or remaining_loans is 0
 Sort based on payment type
 Remove loans as paid
 Increment month

 Loop above until remaining loans.size is 0

 */

ResultsController.loan_results = {"loans": {}, "totals": {} };

//dicts and arrays are passed by reference
// .add(1,'months');
// .format("MMMM YYYY")
// need to move current_interest to current_principal


ResultsController.compute_results = function () {

    var loans_dict = window.loans;

    var loans = [];
    for (var index in loans_dict) {
        loans.push(loans_dict[index]);
    }

    return ResultsController.calculate(loans, window.payment_type, window.monthly_payment);

};

ResultsController.calculate = function (loans, payment_type, monthly_payment) {
    ResultsController.loan_results = {"loans": {}, "totals": {} };
    var remaining_loans = {};
    var current_principal = {};
    var current_interest = {};
    var minimum_payments = {};
    var month = moment().startOf('month');

    for (var loan_key in loans) {
        ResultsController.loan_results.loans[loan_key] = {"rows": [], "loan_name": loans[loan_key].loanName,
            "total_date": "0", "total_interest_paid": 0, "id": loan_key, "starting_balance": loans[loan_key].currentBalance};
        current_principal[loan_key] = loans[loan_key].currentBalance;
        current_interest[loan_key] = 0;
        remaining_loans[loan_key] = loans[loan_key];
        ResultsController.log_default_line(loan_key, month);
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        ResultsController.log_balance_remaining_line(loan_key, current_balance);

    }


    //loop
    var counter = 0;
    while (Object.keys(remaining_loans).length > 0) {
        counter++;
        if (counter > 12*122){
            return null;
        }
        month.add(1, 'months');
        var extra_payment = monthly_payment;
        for (var loan_key in remaining_loans) {
            minimum_payments[loan_key] = remaining_loans[loan_key].minimumPayment;
            extra_payment = extra_payment - minimum_payments[loan_key];
            ResultsController.log_default_line(loan_key, month)
        }
        // pay minimums first
        ResultsController.pay_minimums(remaining_loans, current_principal, current_interest, minimum_payments);
        extra_payment = extra_payment + ResultsController.add_leftover_payments(minimum_payments);
        ResultsController.remove_paid_off_loans(remaining_loans, current_principal, current_interest, minimum_payments);
        ResultsController.apply_extra_payments(remaining_loans, current_principal, current_interest, payment_type, extra_payment, minimum_payments);
        for (var loan_key in remaining_loans) {
            var current_balance = current_principal[loan_key] + current_interest[loan_key];

            ResultsController.log_balance_remaining_line(loan_key, current_balance);
        }

        ResultsController.add_interest(remaining_loans, current_principal, current_interest);

    }

    ResultsController.log_totals(month);
    return ResultsController.loan_results;

};

ResultsController.remove_paid_off_loans = function (remaining_loans, current_principal, current_interest, minimum_payments) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        if (current_balance == 0) {
            ResultsController.remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, loan_key);
        }
    }
};

ResultsController.remove_loan = function (remaining_loans, current_principal, current_interest, minimum_payments, loan_key) {
    delete remaining_loans[loan_key];
    delete current_principal[loan_key];
    delete current_interest[loan_key];
    delete minimum_payments[loan_key];
};

ResultsController.pay_minimums = function (remaining_loans, current_principal, current_interest, minimum_payments) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        var left_over = ResultsController.apply_payment(loan_key, minimum_payments[loan_key], current_interest, current_principal);
        minimum_payments[loan_key] = left_over;

    }
};


ResultsController.apply_payment = function (id, payment, interest_dict, principal_dict) {

    // interest higher than payment
    if (interest_dict[id] > payment) {
        ResultsController.log_interest_paid_line(id, payment);
        interest_dict[id] = interest_dict[id] - payment;
        return 0;
    }
    // interest equal to payment
    else if (interest_dict[id] == payment) {
        ResultsController.log_interest_paid_line(id, payment);
        interest_dict[id] = interest_dict[id] - payment;
        return 0;
    }
    // payment higher than interest left
    else {
        ResultsController.log_interest_paid_line(id, interest_dict[id]);
        var remaining_payment = payment - interest_dict[id];
        interest_dict[id] = 0;
        // apply to principal
        return ResultsController.principal_apply_payment(id, remaining_payment, principal_dict);
    }
};

ResultsController.principal_apply_payment = function (id, payment, principal_dict) {

    // principal higher than payment
    if (principal_dict[id] > payment) {
        ResultsController.log_principal_paid_line(id, payment);
        principal_dict[id] = principal_dict[id] - payment;
        return 0;
    }
    // principal equal to payment
    else if (principal_dict[id] == payment) {
        ResultsController.log_principal_paid_line(id, payment);
        principal_dict[id] = principal_dict[id] - payment;
        return 0;
    }
    // payment higher than principal left
    else {

        ResultsController.log_principal_paid_line(id, principal_dict[id]);
        var remaining_payment = payment - principal_dict[id];
        principal_dict[id] = 0;
        return remaining_payment;
    }
};

//assuming monthly
ResultsController.add_interest = function (remaining_loans, current_principal, current_interest) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        //assuming monthly
        var interest_generated = current_balance * (remaining_loans[loan_key].interestRate / 100 / 12);
        current_interest[loan_key] = current_interest[loan_key] + ResultsController.precise_round(interest_generated, 2);
    }
};

ResultsController.apply_extra_payments = function (remaining_loans, current_principal, current_interest, payment_type, extra_payment, minimum_payments) {
    var sorted_keys = ResultsController.sort_loans(remaining_loans, current_principal, current_interest, payment_type);
    for (var key in sorted_keys) {
        if (extra_payment == 0 || Object.keys(remaining_loans).length == 0) {
            return extra_payment;
        }
        extra_payment = ResultsController.apply_payment(sorted_keys[key], extra_payment, current_interest, current_principal);
        if ((current_principal[sorted_keys[key]] + current_interest[sorted_keys[key]]) == 0) {
            ResultsController.remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, sorted_keys[key]);
        }
    }
};


ResultsController.add_leftover_payments = function (minimum_payments) {
    var leftover = 0;
    for (var key in minimum_payments) {
        leftover += minimum_payments[key];
    }
    return leftover;
};


ResultsController.precise_round = function (num, decimals) {
    var t = Math.pow(10, decimals);
    return parseFloat((Math.round((num * t) + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals));
};

ResultsController.sort_loans = function (remaining_loans, current_principal, current_interest, payment_type) {
    if (payment_type == "snowball") {
        return Object.keys(remaining_loans).sort(function (a, b) {
            return (current_interest[a] + current_principal[a]) - (current_interest[b] + current_principal[b])
        });
    }
    else if (payment_type == "avalanche") {
        return Object.keys(remaining_loans).sort(function (a, b) {
            return (remaining_loans[b].interestRate) - (remaining_loans[a].interestRate)
        });
    }
    else {
        console.log("something fucky happened")
    }
};


// not sure where I used this
ResultsController.round_interest_diff = function (a) {
    if (a > 0) {
        a = Math.ceil(a);
    }
    else if (a < 0) {
        a = Math.floor(a);

    }
    else {
        return a;
    }
};

ResultsController.arraysEqual = function (a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};


// loan_results = { "0": [line, line], "1": [line, line] }
// line = {month, payment,principal_paid,interest_paid,balance_remaining}
ResultsController.log_default_line = function (id, date) {
    ResultsController.loan_results.loans[id].rows.push({});
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["date"] = date.format("MMMM YYYY");
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["payment"] = 0;
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["principal_paid"] = 0;
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["interest_paid"] = 0;
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["balance_remaining"] = 0;
};


ResultsController.log_date_line = function (id, date) {
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["date"] = date.format("MMMM YYYY");
};

ResultsController.log_payment_line = function (id, payment) {
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["payment"] += ResultsController.precise_round(payment, 2);
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["payment"] =
        ResultsController.precise_round(ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["payment"], 2);
};

ResultsController.log_principal_paid_line = function (id, principal_paid) {
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["principal_paid"] = ResultsController.precise_round(ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["principal_paid"]+ principal_paid, 2);
    ResultsController.log_payment_line(id, principal_paid);
};

ResultsController.log_interest_paid_line = function (id, interest_paid) {

    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["interest_paid"] = ResultsController.precise_round(ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["interest_paid"]+interest_paid, 2);
    ResultsController.log_payment_line(id, interest_paid);
};

ResultsController.log_balance_remaining_line = function (id, balance_remaining) {
    ResultsController.loan_results.loans[id].rows[ResultsController.loan_results.loans[id].rows.length - 1]["balance_remaining"] += ResultsController.precise_round(balance_remaining, 2);
};

ResultsController.log_totals = function (date) {
    ResultsController.loan_results.totals["total_date"] = date.format("MMMM YYYY");
    var total_interest_paid = 0;
    for (var loan_key in  ResultsController.loan_results.loans) {
        ResultsController.loan_results.loans[loan_key].total_interest_paid = 0;
        for (var line_key in ResultsController.loan_results.loans[loan_key].rows) {
            ResultsController.loan_results.loans[loan_key].total_interest_paid += ResultsController.loan_results.loans[loan_key].rows[line_key]["interest_paid"];
        }
        ResultsController.loan_results.loans[loan_key].total_interest_paid = ResultsController.precise_round(ResultsController.loan_results.loans[loan_key].total_interest_paid, 2);
        ResultsController.loan_results.loans[loan_key].total_date = ResultsController.loan_results.loans[loan_key].rows[ResultsController.loan_results.loans[loan_key].rows.length - 1]["date"];
        total_interest_paid += ResultsController.loan_results.loans[loan_key].total_interest_paid
    }
    ResultsController.loan_results.totals["total_interest_paid"] = ResultsController.precise_round(total_interest_paid,2);
};






