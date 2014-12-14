function Loan(id, loanName, currentBalance, minimumPayment, interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;
}

// ideas
// mortgage calculator
// auto payments
// savings
// retirement planner
// value of money
// college investment calculator
// finance vs cash caluclator
// estimate minimum payments

// loan
// fields - id, name, balance, min payment, interest rate

//loan line result
// month, payment, principal paid, interest paid, principal remaining

// loan results - { "1": [loan_line_1], "2": [loan_line_2]}


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

var loan_results = {};

//dicts and arrays are passed by reference
// .add(1,'months');
// .format("MMMM YYYY")
// need to move current_interest to current_principal

var calculate_results = function (loans, payment_type, monthly_payment) {
    loan_results = {};
    var remaining_loans = {};
    var current_principal = {};
    var current_interest = {};
    var minimum_payments = {};
    var month = moment().startOf('month');

    for (var loan_key in loans) {
        loan_results[loan_key] = [];
        current_principal[loan_key] = loans[loan_key].currentBalance;
        current_interest[loan_key] = 0;
        remaining_loans[loan_key] = loans[loan_key];
        log_default_line(loan_key, month)
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        log_balance_remaining_line(loan_key, current_balance);

    }


    //loop
    while (Object.keys(remaining_loans).length > 0) {
        month.add(1, 'months');
        var extra_payment = monthly_payment;
        for (var loan_key in remaining_loans) {
            minimum_payments[loan_key] = remaining_loans[loan_key].minimumPayment;
            extra_payment = extra_payment - minimum_payments[loan_key];
            log_default_line(loan_key, month)
        }
        // pay minimums first
        pay_minimums(remaining_loans, current_principal, current_interest, minimum_payments);
        extra_payment = extra_payment + add_leftover_payments(minimum_payments);
        remove_paid_off_loans(remaining_loans, current_principal, current_interest, minimum_payments);
        apply_extra_payments(remaining_loans, current_principal, current_interest, payment_type,extra_payment, minimum_payments);
        for (var loan_key in remaining_loans) {
            var current_balance = current_principal[loan_key] + current_interest[loan_key];

            log_balance_remaining_line(loan_key, current_balance);
        }

        add_interest(remaining_loans,current_principal,current_interest);

    }

    return loan_results;

};

var remove_paid_off_loans = function (remaining_loans, current_principal, current_interest, minimum_payments) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        if (current_balance == 0) {
            remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, loan_key);
        }
    }
};

var remove_loan = function (remaining_loans, current_principal, current_interest, minimum_payments, loan_key) {
    delete remaining_loans[loan_key];
    delete current_principal[loan_key];
    delete current_interest[loan_key];
    delete minimum_payments[loan_key];
};

var pay_minimums = function (remaining_loans, current_principal, current_interest, minimum_payments) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        var left_over = apply_payment(loan_key, minimum_payments[loan_key], current_interest, current_principal);
        minimum_payments[loan_key] = left_over;

    }
};


var apply_payment = function (id, payment, interest_dict, principal_dict) {

    // interest higher than payment
    if (interest_dict[id] > payment) {
        log_interest_paid_line(id, payment);
        interest_dict[id] = interest_dict[id] - payment;
        return 0;
    }
    // interest equal to payment
    else if (interest_dict[id] == payment) {
        log_interest_paid_line(id, payment);
        interest_dict[id] = interest_dict[id] - payment;
        return 0;
    }
    // payment higher than interest left
    else {
        log_interest_paid_line(id, interest_dict[id]);
        var remaining_payment = payment - interest_dict[id];
        interest_dict[id] = 0;
        // apply to principal
        return principal_apply_payment(id, remaining_payment, principal_dict);
    }
};

var principal_apply_payment = function (id, payment, principal_dict) {

    // principal higher than payment
    if (principal_dict[id] > payment) {
        log_principal_paid_line(id, payment);
        principal_dict[id] = principal_dict[id] - payment;
        return 0;
    }
    // principal equal to payment
    else if (principal_dict[id] == payment) {

        log_principal_paid_line(id, payment);
        principal_dict[id] = principal_dict[id] - payment;
        return 0;
    }
    // payment higher than principal left
    else {

        log_principal_paid_line(id, principal_dict[id]);
        var remaining_payment = payment - principal_dict[id];
        principal_dict[id] = 0;
        return remaining_payment;
    }
};

//assuming monthly
var add_interest = function (remaining_loans, current_principal, current_interest) {
    for (var loan_key in remaining_loans) {
        var current_balance = current_principal[loan_key] + current_interest[loan_key];
        //assuming monthly
        var interest_generated = current_balance * (remaining_loans[loan_key].interestRate / 100 / 12);
        current_interest[loan_key] = current_interest[loan_key] + precise_round(interest_generated, 2);
    }
};

var apply_extra_payments = function (remaining_loans, current_principal, current_interest, payment_type, extra_payment,minimum_payments) {
    var sorted_keys = sort_loans(remaining_loans, current_principal, current_interest, payment_type);
    for (var key in sorted_keys) {
        if (extra_payment == 0 || Object.keys(remaining_loans).length == 0) {
            return extra_payment;
        }
        extra_payment = apply_payment(sorted_keys[key], extra_payment, current_interest, current_principal);
        if ((current_principal[sorted_keys[key]] + current_interest[sorted_keys[key]]) == 0) {
            remove_loan(remaining_loans, current_principal, current_interest, minimum_payments, sorted_keys[key]);
        }
    }
};


var add_leftover_payments = function (minimum_payments) {
    var leftover = 0;
    for (var key in minimum_payments) {
        leftover += minimum_payments[key];
    }
    return leftover;
};


var precise_round = function (num, decimals) {
    var t = Math.pow(10, decimals);
    return parseFloat((Math.round((num * t) + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals));
};

var sort_loans = function (remaining_loans, current_principal, current_interest, payment_type) {
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
var round_interest_diff = function (a) {
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

var arraysEqual = function (a, b) {
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
var log_default_line = function (id, date) {
    loan_results[id].push({});
    loan_results[id][loan_results[id].length - 1]["date"] = date.format("MMMM YYYY");
    loan_results[id][loan_results[id].length - 1]["payment"] = 0;
    loan_results[id][loan_results[id].length - 1]["principal_paid"] = 0;
    loan_results[id][loan_results[id].length - 1]["interest_paid"] = 0;
    loan_results[id][loan_results[id].length - 1]["balance_remaining"] = 0;
};


var log_date_line = function (id, date) {
    loan_results[id][loan_results[id].length - 1]["date"] = date.format("MMMM YYYY");
};

var log_payment_line = function (id, payment) {
    loan_results[id][loan_results[id].length - 1]["payment"] += precise_round(payment, 2);
};

var log_principal_paid_line = function (id, principal_paid) {
    loan_results[id][loan_results[id].length - 1]["principal_paid"] += precise_round(principal_paid, 2);
    //console.log(id + " " + principal_paid);
    log_payment_line(id, principal_paid);
};

var log_interest_paid_line = function (id, interest_paid) {

    loan_results[id][loan_results[id].length - 1]["interest_paid"] += precise_round(interest_paid, 2);
    log_payment_line(id, interest_paid);
};

var log_balance_remaining_line = function (id, balance_remaining) {
    loan_results[id][loan_results[id].length - 1]["balance_remaining"] += precise_round(balance_remaining, 2);
};





