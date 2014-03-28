$().ready( function(){

    window.auto_increment = -1;
    window.loans = {};

    Router.prototype.init();
    LoanController.prototype.add_loan();
    Router.prototype.add_monthy_payment_listener();
});