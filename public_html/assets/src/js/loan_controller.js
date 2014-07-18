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

LoanController.valid = function() {
    return $(".input-error").length;
};

LoanController.hashString = function () {
    var hashString = '';
    for (var key in window.loans) {
        var loan = window.loans[key];
        console.log(loan);
        hashString += 'name_' + loan.id + '=' + loan.loanName + '&';
        hashString += 'balance_' + loan.id + '=' + loan.currentBalance + '&';
        hashString += 'payment_' + loan.id + '=' + loan.minimumPayment + '&';
        hashString += 'rate_' + loan.id + '=' + loan.interestRate + '&';
    }
    return hashString;
};







