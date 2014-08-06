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
            this.currentBalance = Number(new_value.replace(/[^0-9\.]+/g,""));
            break;
        case "minimum-payment":
            this.minimumPayment = Number(new_value.replace(/[^0-9\.]+/g,""));

            break;
        case "interest-rate":
            this.interestRate = Number(new_value.replace(/[^0-9\.\-]+/g,""));
            break;
    }
    ApplicationController.monthly_payment_input_change();

};





Loan.prototype.validate_field = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            console.log(new_value);
            return new_value.length;
        case "current-balance":
        case "minimum-payment":
            new_value = new_value.replace(/[$,]+/g,"");
            return $.isNumeric(new_value) && Number(new_value) >= 0;
        case "interest-rate":
            new_value = new_value.replace(/[$,%]+/g,"");
            return $.isNumeric(new_value);
    }
};
