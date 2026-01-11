import { useCallback, useState, useEffect } from 'react';
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
  // Local state for raw input strings to handle typing (avoid parsing on every keystroke)
  const [localBalance, setLocalBalance] = useState(currentBalance ? String(currentBalance) : '');
  const [localPayment, setLocalPayment] = useState(minimumPayment ? String(minimumPayment) : '');
  const [localRate, setLocalRate] = useState(interestRate ? String(interestRate) : '');

  // Sync local state when props change (e.g., from URL loading)
  useEffect(() => {
    setLocalBalance(currentBalance ? String(currentBalance) : '');
  }, [currentBalance]);

  useEffect(() => {
    setLocalPayment(minimumPayment ? String(minimumPayment) : '');
  }, [minimumPayment]);

  useEffect(() => {
    setLocalRate(interestRate ? String(interestRate) : '');
  }, [interestRate]);

  const getValidationClass = useCallback((field: LoanFieldName, value: string) => {
    if (value === '') return '';
    return validateLoanField(field, value) ? 'input-success' : 'input-error';
  }, []);

  const handleChange = useCallback(
    (field: LoanFieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // For name field, update immediately
      if (field === 'loan-name') {
        onFieldChange(id, field, value);
      }
      // For numeric fields, update local state only
      else if (field === 'current-balance') {
        setLocalBalance(value);
      } else if (field === 'minimum-payment') {
        setLocalPayment(value);
      } else if (field === 'interest-rate') {
        setLocalRate(value);
      }
    },
    [id, onFieldChange]
  );

  const handleBlur = useCallback(
    (field: LoanFieldName) => () => {
      // On blur, send the current local value to parent for parsing
      if (field === 'current-balance') {
        onFieldChange(id, field, localBalance);
      } else if (field === 'minimum-payment') {
        onFieldChange(id, field, localPayment);
      } else if (field === 'interest-rate') {
        onFieldChange(id, field, localRate);
      }
    },
    [id, onFieldChange, localBalance, localPayment, localRate]
  );

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);

  return (
    <div className="loan-input-row" id={`loan${id}`} data-loan-id={id}>
      <div className="row">
        <div className="col-sm-3">
          <label htmlFor={`loan-name-${id}`}>Loan Name</label>
          <input
            type="text"
            id={`loan-name-${id}`}
            name="loan-name"
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
              name="current-balance"
              className={`form-control loan-input ${getValidationClass('current-balance', localBalance)}`}
              placeholder="50,000"
              value={localBalance}
              onChange={handleChange('current-balance')}
              onBlur={handleBlur('current-balance')}
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
              name="minimum-payment"
              className={`form-control loan-input ${getValidationClass('minimum-payment', localPayment)}`}
              placeholder="500"
              value={localPayment}
              onChange={handleChange('minimum-payment')}
              onBlur={handleBlur('minimum-payment')}
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
              name="interest-rate"
              className={`form-control loan-input ${getValidationClass('interest-rate', localRate)}`}
              placeholder="6.8"
              value={localRate}
              onChange={handleChange('interest-rate')}
              onBlur={handleBlur('interest-rate')}
              data-field="interest-rate"
            />
            <span className="input-group-text">%</span>
          </div>
        </div>
        <div className="col-sm-2 d-flex align-items-end">
          <button
            type="button"
            id={`destroy-button-${id}`}
            className="btn btn-danger destroy-button"
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
