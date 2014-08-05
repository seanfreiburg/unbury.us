/**
 * Created by sefreibu on 8/5/2014.
 */

Array.prototype.clone = function() {
    return this.slice(0);
};

var ResultsController = function () {

};

ResultsController.compute_results = function () {

    var loans_dict = window.loans;

    var loans = [];
    for (var index in loans_dict) {
        loans.push(loans_dict[index]);
    }

    console.log(loans);
    return ResultsController.calculate(loans, payment_type, window.monthly_payment);

};

ResultsController.calculate = function(loans, payment_type, monthly_payment) {
    console.log(loans)
    var remaining_loans =  loans;
    console.log(remaining_loans)
    ResultsController.sortLoans(remaining_loans,payment_type);
    var results_dict = {};
    var current_month = new UDate();
    for (var loan in remaining_loans){
        results_dict[loan.id] = {"loan": loan, "end_date": null, "total_interest_paid": null, "rows": []}
    }
    while(remaining_loans.length > 0){
        var remaining_money = monthly_payment;
        // apply all minimum payments first
        var i = 0;
        for (var loan in remaining_loans){
            if (loan.minimumPayment >= loan.currentBalance){
                console.log("payoff")
                remaining_money = remaining_money - loan.currentBalance;
                loan.currentBalance = 0;
                delete remaining_loans[i];
            }
            else{
                loan.currentBalance = loan.currentBalance - loan.minimumPayment;
                remaining_money = remaining_money - loan.minimumPayment;
            }
            i++;
        }


            // apply extra payments in order
            var i = 0;
            for (var loan in remaining_loans){
                if (remaining_money >= loan.currentBalance){
                    remaining_money = remaining_money - loan.currentBalance;
                    loan.currentBalance = 0;
                    delete remaining_loans[i];
                }
                else {
                    loan.currentBalance = loan.currentBalance - remaining_money;
                    remaining_money = 0;
                    break;
                }
                i++;
            }


        // resort loans
        ResultsController.sortLoans(remaining_loans,payment_type);
        //console.log(remaining_loans.length)
        current_month.increment();

    }

    return current_month.getMonth();

};


ResultsController.sortLoans= function(loans,payment_type) {
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
};
