// Loan class - represents a single loan
export class Loan {
  constructor(id, loanName, currentBalance, minimumPayment, interestRate) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;
  }

  setLoanField(fieldName, newValue) {
    switch (fieldName) {
      case 'loan-name':
        this.loanName = newValue;
        break;
      case 'current-balance':
        this.currentBalance = Number(newValue.replace(/[^0-9.]+/g, ''));
        break;
      case 'minimum-payment':
        this.minimumPayment = Number(newValue.replace(/[^0-9.]+/g, ''));
        break;
      case 'interest-rate':
        this.interestRate = Number(newValue.replace(/[^0-9.-]+/g, ''));
        break;
    }
  }

  static validateField(fieldName, newValue) {
    switch (fieldName) {
      case 'loan-name':
        return newValue.length > 0;
      case 'current-balance':
      case 'minimum-payment':
        newValue = newValue.replace(/[$,]+/g, '');
        return $.isNumeric(newValue) && Number(newValue) >= 0;
      case 'interest-rate':
        newValue = newValue.replace(/[$,%]+/g, '');
        return $.isNumeric(newValue);
    }
    return false;
  }
}

export default Loan;
