function Router() {

}


Router.init = function () {


    $("#add-loan").click(function () {
        LoanController.add_loan();
    });

};


Router.add_monthy_payment_listener = function () {
    $("#monthly-payment").focusout(function () {
        console.log($(this).val());
    });
};

Router.add_loan_destroy_listener = function (id) {
    $("#destroy-button-" + id).click(function () {
        LoanController.remove_loan(id);
    });
};

Router.add_loan_input_listeners = function (id) {
    Router.add_loan_input_listener(id, "loan-name");
    Router.add_loan_input_listener(id, "current-balance");
    Router.add_loan_input_listener(id, "minimum-payment");
    Router.add_loan_input_listener(id, "interest-rate");
};


Router.add_loan_input_listener = function (id, field_name) {
    $("#loan" + id).find("input[name=" + field_name + "]").focusout(function () {
        LoanController.input_change(id, field_name,this);
    });
};