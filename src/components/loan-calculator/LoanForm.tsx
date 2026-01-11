import { useCallback } from 'react';
import { useLoanCalculator } from '../../context/LoanCalculatorContext';
import { Button } from '../common/Button';

export function LoanForm() {
  const { state, setMonthlyPayment, totalMinimumPayment, isValid, calculate } = useLoanCalculator();

  const handleMonthlyPaymentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
      setMonthlyPayment(value);
    },
    [setMonthlyPayment]
  );

  const handleCalculate = useCallback(() => {
    calculate();
  }, [calculate]);

  const isPaymentSufficient = state.monthlyPayment >= totalMinimumPayment;

  return (
    <div className="loan-form">
      <div className="row align-items-end">
        <div className="col-sm-4">
          <label htmlFor="monthly-payment">Total Monthly Payment</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              id="monthly-payment"
              className={`form-control ${isPaymentSufficient ? 'input-success' : 'input-error'}`}
              placeholder="Enter your total monthly payment"
              value={state.monthlyPayment || ''}
              onChange={handleMonthlyPaymentChange}
            />
          </div>
          {!isPaymentSufficient && totalMinimumPayment > 0 && (
            <small className="text-danger">
              Minimum required: ${totalMinimumPayment.toFixed(2)}
            </small>
          )}
        </div>
        <div className="col-sm-4">
          <Button
            id="calculate"
            variant="success"
            size="lg"
            onClick={handleCalculate}
            disabled={!isValid}
          >
            Calculate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoanForm;
