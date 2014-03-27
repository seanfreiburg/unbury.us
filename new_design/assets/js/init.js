$().ready( function(){

    window.auto_increment = -1;
    window.loans = {};
    add_loan();
    add_monthy_payment_listener();
});