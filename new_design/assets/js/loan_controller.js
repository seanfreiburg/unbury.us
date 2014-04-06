var LoanController = function() {

};


LoanController.add_loan = function () {
    window.auto_increment += 1;
    var id = window.auto_increment;
    var source = $("#loan-input-template").html();
    var template = Handlebars.compile(source);
    var context = {id: id};
    var html = template(context);
    $("#loan-inputs").append(html);
    $("#loan" + id).hide().fadeIn('500');
    window.loans[id] = new Loan(id, 0, 0, 0, 0);
    Router.add_loan_destroy_listener(id);
    Router.add_loan_input_listeners(id);


};


LoanController.remove_loan = function (id) {
    var loan_div = $("#loan" + id);
    loan_div.next().remove();
    loan_div.animate({ height: 0, opacity: 0 }, 'slow', function () {
        $(this).remove();

    });

    delete window.loans[id];

};


LoanController.loan_input_change = function (id, field_name, context) {
    var value = $(context).val();
    var loan = window.loans[id];

    if (Loan.prototype.validate_field(field_name, value)) {
        $(context).removeClass("input-error").addClass("input-success");
        loan.set_loan_field(field_name, value);
    }
    else {
        $(context).removeClass("input-success").addClass("input-error");

    }
};

LoanController.monthly_payment_input_change = function (context) {
    var value = parseFloat($(context).val());
    // @todo, add check to make sure it's larger than the sum of the min payments
    if ($.isNumeric(value) && Number(value) > 0) {
        $(context).removeClass("input-error").addClass("input-success");
        window.monthly_payment = value;
    }
    else {
        $(context).removeClass("input-success").addClass("input-error");
    }
};





