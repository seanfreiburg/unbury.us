import { useCallback } from 'react';
import type { LoanFieldName } from '../../utils/validation';
import { validateLoanField } from '../../utils/validation';

interface LoanInputRowProps {
  id: number;
  loanName: string;
  currentBalance: number;
  minimumPayment: number;
  interestRate: number;
  onFieldChange: (id: number, field: LoanFieldName, value: string) => void;
  onRemove: (id: number) => void;
}

export function LoanInputRow({
  id,
  loanName,
  currentBalance,
  minimumPayment,
  interestRate,
  onFieldChange,
  onRemove,
}: LoanInputRowProps) {
  const getValidationClass = useCallback((field: LoanFieldName, value: string) => {
    if (value === '') return '';
    return validateLoanField(field, value) ? 'input-success' : 'input-error';
  }, []);

  const handleChange = useCallback(
    (field: LoanFieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(id, field, e.target.value);
    },
    [id, onFieldChange]
  );

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);

  return (
    <div className="loan-input-row" data-loan-id={id}>
      <div className="row">
        <div className="col-sm-3">
          <label htmlFor={`loan-name-${id}`}>Loan Name</label>
          <input
            type="text"
            id={`loan-name-${id}`}
            className={`form-control loan-input ${getValidationClass('loan-name', loanName)}`}
            placeholder="Student Loan"
            value={loanName}
            onChange={handleChange('loan-name')}
            data-field="loan-name"
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor={`current-balance-${id}`}>Current Balance</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              id={`current-balance-${id}`}
              className={`form-control loan-input ${getValidationClass('current-balance', String(currentBalance))}`}
              placeholder="50,000"
              value={currentBalance || ''}
              onChange={handleChange('current-balance')}
              data-field="current-balance"
            />
          </div>
        </div>
        <div className="col-sm-2">
          <label htmlFor={`minimum-payment-${id}`}>Minimum Payment</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              id={`minimum-payment-${id}`}
              className={`form-control loan-input ${getValidationClass('minimum-payment', String(minimumPayment))}`}
              placeholder="500"
              value={minimumPayment || ''}
              onChange={handleChange('minimum-payment')}
              data-field="minimum-payment"
            />
          </div>
        </div>
        <div className="col-sm-2">
          <label htmlFor={`interest-rate-${id}`}>Interest Rate</label>
          <div className="input-group">
            <input
              type="text"
              id={`interest-rate-${id}`}
              className={`form-control loan-input ${getValidationClass('interest-rate', String(interestRate))}`}
              placeholder="6.8"
              value={interestRate || ''}
              onChange={handleChange('interest-rate')}
              data-field="interest-rate"
            />
            <span className="input-group-text">%</span>
          </div>
        </div>
        <div className="col-sm-2 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRemove}
            aria-label={`Remove loan ${loanName || id}`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoanInputRow;
