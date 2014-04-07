$().ready(function () {
    window.payment_type = "snowball";
    window.loans = {};
    window.loans[1] = new Loan(1, 0, 500, 0, 4);
    window.loans[2] = new Loan(2, 0, 400, 0, 3);
    window.loans[3] = new Loan(3, 0, 300, 0, 2);
    var data = ResultsController.compute_results();
    $('#data-out').append(JSON.stringify(data, undefined, 2));

});