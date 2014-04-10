$().ready(function () {
    window.payment_type = "avalanche";
    window.loans = {};
    window.monthly_payment = 200;
    window.loans[1] = new Loan(1, 0, 500, 50, 10);
    window.loans[2] = new Loan(2, 0, 400, 50, 3);
    window.loans[3] = new Loan(3, 0, 300, 40, 2);


    var data = ResultsController.compute_results();
    $('#data-out').append(JSON.stringify(data, undefined, 2));

});