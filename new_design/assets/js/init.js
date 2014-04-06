$().ready( function(){

    window.auto_increment = -1;
    window.monthly_payment = 0;
    window.loans = {};

    Router.init();

    LoanController.add_loan();
    Router.add_monthy_payment_listener();
    Router.add_calculate_listener();
});

