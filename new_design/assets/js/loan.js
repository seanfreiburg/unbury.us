function Loan(id,loanName,currentBalance,minimumPayment,interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;

}

Loan.prototype.setLoanName = function(new_value){
   this.loanName = new_value;
};




Loan.prototype.setCurrentBalance = function(new_value){
    this.currentBalance = new_value;
};


Loan.prototype.setMinimumPayment = function(new_value){
    this.minimumPayment = new_value;
};


Loan.prototype.setInterestRate = function(new_value){
    this.interestRate = new_value;
};


Loan.prototype.validateField = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            return true;
        case "current-balance":
        case "minimum-payment":
        case "interest-rate":
            return $.isNumeric(new_value);
    }
};
