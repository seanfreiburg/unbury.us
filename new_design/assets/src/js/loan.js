function Loan(id,loanName,currentBalance,minimumPayment,interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;

}

Loan.prototype.set_loan_field = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            this.loanName = new_value;
            break;
        case "current-balance":
            this.currentBalance = Number(new_value);
            break;
        case "minimum-payment":
            this.minimumPayment = Number(new_value);

            break;
        case "interest-rate":
            this.interestRate = Number(new_value);
            break;
    }
    ApplicationController.monthly_payment_input_change();

};





Loan.prototype.validate_field = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            return new_value.length;
        case "current-balance":
        case "minimum-payment":
        case "interest-rate":
            return $.isNumeric(new_value) && Number(new_value) > 0;
    }
};
