$().ready(function () {
    window.loans = {};
    window.loans[1] = new Loan(1, 0, 0, 0, 0);
    window.loans[2] = new Loan(2, 0, 0, 0, 0);
    window.loans[3] = new Loan(3, 0, 0, 0, 0);
    var data = ResultsController.compute_results();
    console.log(data);
    $('#data-out').append(JSON.stringify(data, undefined, 2));

});