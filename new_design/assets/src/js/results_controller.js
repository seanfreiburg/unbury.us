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
        console.log("snowball");
        loans.sort(function (a, b) {
            return a.currentBalance - b.currentBalance;
        });
        console.log(loans);
    }

    return loans;

};

