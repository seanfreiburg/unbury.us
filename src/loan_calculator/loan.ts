// Loan class - represents a single loan
import {
  type LoanFieldName,
  validateLoanField,
  parseCurrency,
  parsePercentage,
} from '../utils/validation';

export type { LoanFieldName };

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
        this.currentBalance = parseCurrency(newValue);
        break;
      case 'minimum-payment':
        this.minimumPayment = parseCurrency(newValue);
        break;
      case 'interest-rate':
        this.interestRate = parsePercentage(newValue);
        break;
    }
  }

  static validateField(fieldName: LoanFieldName, newValue: string): boolean {
    return validateLoanField(fieldName, newValue);
  }
}

export default Loan;
