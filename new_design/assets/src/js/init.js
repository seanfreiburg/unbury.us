$().ready(function () {
    window.loans = {};
    window.auto_increment = -1;
    window.monthly_payment = 0;
    ApplicationController.monthly_payment_input_change();


    window.payment_type = "avalanche";

    Router.init();

    LoanController.add_loan();
    Router.add_monthly_payment_listener();
    Router.add_calculate_listener();

    Handlebars.registerPartial("row", $("#loan-table-row-partial").html());
});

