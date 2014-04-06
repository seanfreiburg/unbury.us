function Loan(id,loanName,currentBalance,minimumPayment,interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;

}




Loan.validateField = function(field_name, new_value){
    switch (field_name) {
        case "loan-name":
            return true;
        case "current-balance":
        case "minimum-payment":
        case "interest-rate":
            return $.isNumeric(new_value) && Number(new_value) > 0;
    }
};
