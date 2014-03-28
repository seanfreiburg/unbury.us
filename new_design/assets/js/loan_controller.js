function LoanController() {

}


LoanController.prototype.add_loan = function () {
    window.auto_increment += 1;
    var id = window.auto_increment;
    var source = $("#loan-input-template").html();
    var template = Handlebars.compile(source);
    var context = {id: id};
    var html = template(context);
    $("#loan-inputs").append(html);
    $("#loan" + id).hide().fadeIn();
    window.loans[id] = new Loan(id, 0, 0, 0, 0);
    add_loan_destroy_listener(id);
    add_loan_input_listeners(id);


};


var remove_loan = function (id) {
    var loan_div = $("#loan" + id);
    loan_div.next().remove();
    loan_div.animate({ height: 0, opacity: 0 }, 'slow', function () {
        $(this).remove();

    });

    delete window.loans[id];

};


var add_loan_destroy_listener = function (id) {
    $("#destroy-button-" + id).click(function () {
        remove_loan(id);
    });
};

var add_loan_input_listeners = function (id) {
    add_loan_input_listener(id, "loan-name");
    add_loan_input_listener(id, "current-balance");
    add_loan_input_listener(id, "minimum-payment");
    add_loan_input_listener(id, "interest-rate");
};

var add_loan_input_listener = function (id, field_name) {
    $("#loan" + id).find("input[name=" + field_name + "]").focusout(function () {
        console.log(field_name);
        var loan = window.loans[id];
        var new_value = $(this).val();
        if (Loan.prototype.validateField(field_name, new_value)) {
            $(this).removeClass("input-error").addClass("input-success");
        }
        else {
            $(this).removeClass("input-success").addClass("input-error");
        }
    });
};