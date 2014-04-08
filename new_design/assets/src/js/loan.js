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
            this.set_loan_name(new_value);
            break;
        case "current-balance":
            this.set_current_balance(new_value);
            break;
        case "minimum-payment":
            this.set_minimum_payment(new_value);
            break;
        case "interest-rate":
            this.set_interest_rate(new_value);
            break;
    }


};


Loan.prototype.get_loan_name = function(new_value){
    return this.loanName;
};


Loan.prototype.set_loan_name = function(new_value){
    this.loanName = new_value;
};

Loan.prototype.get_current_balance= function(new_value){
    return this.loanName;
};

Loan.prototype.set_current_balance = function(new_value){
    this.currentBalance = parseFloat(new_value);
};

Loan.prototype.get_minimum_payment = function(new_value){
    return this.loanName;
};

Loan.prototype.set_minimum_payment = function(new_value){
    this.minimumPayment = parseFloat(new_value);
};

Loan.prototype.get_interest_rate = function(new_value){
    return this.loanName;
};

Loan.prototype.set_interest_rate = function(new_value){
    this.interestRate = parseFloat(new_value);
};




Loan.prototype.validate_field = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            return true;
        case "current-balance":
        case "minimum-payment":
        case "interest-rate":
            return $.isNumeric(new_value) && Number(new_value) > 0;
    }
};
