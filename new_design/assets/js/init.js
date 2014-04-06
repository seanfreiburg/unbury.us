$().ready( function(){

    window.auto_increment = -1;
    window.loans = {};

    Router.init();
    LoanController.add_loan();
    Router.add_monthy_payment_listener();
});