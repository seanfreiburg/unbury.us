function Router(){

}


Router.prototype.init = function () {


    $("#add-loan").click(function () {
        LoanController.prototype.add_loan();
    });

};


Router.prototype.add_monthy_payment_listener = function () {
    $("#monthly-payment").focusout(function () {
        console.log($(this).val());
    });
};