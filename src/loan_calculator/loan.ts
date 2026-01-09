// Loan class - represents a single loan


export type LoanFieldName =
  | 'loan-name'
  | 'current-balance'
  | 'minimum-payment'
  | 'interest-rate';

export class Loan {
  id: number;
  loanName: string;
  currentBalance: number;
  minimumPayment: number;
  interestRate: number;

  constructor(
    id: number,
    loanName: string,
    currentBalance: number,
    minimumPayment: number,
    interestRate: number
  ) {
    this.id = id;
    this.loanName = loanName;
    this.currentBalance = currentBalance;
    this.minimumPayment = minimumPayment;
    this.interestRate = interestRate;
  }

  setLoanField(fieldName: LoanFieldName, newValue: string): void {
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

  static validateField(fieldName: LoanFieldName, newValue: string): boolean {
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
