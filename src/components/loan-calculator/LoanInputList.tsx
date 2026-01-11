import { useCallback } from 'react';
import { useLoanCalculator } from '../../context/LoanCalculatorContext';
import { LoanInputRow } from './LoanInputRow';
import { Button } from '../common/Button';
import type { LoanFieldName } from '../../utils/validation';

export function LoanInputList() {
  const { state, addLoan, removeLoan, updateLoanField } = useLoanCalculator();

  const handleFieldChange = useCallback(
    (id: number, field: LoanFieldName, value: string) => {
      updateLoanField(id, field, value);
    },
    [updateLoanField]
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeLoan(id);
    },
    [removeLoan]
  );

  const handleAddLoan = useCallback(() => {
    addLoan();
  }, [addLoan]);

  const loanIds = Object.keys(state.loans).map(Number);

  return (
    <div className="loan-input-list">
      {loanIds.map((id) => {
        const loan = state.loans[id];
        return (
          <LoanInputRow
            key={id}
            id={id}
            loanName={loan.loanName}
            currentBalance={loan.currentBalance}
            minimumPayment={loan.minimumPayment}
            interestRate={loan.interestRate}
            onFieldChange={handleFieldChange}
            onRemove={handleRemove}
          />
        );
      })}
      <div className="mt-3">
        <Button variant="primary" onClick={handleAddLoan}>
          Add Another Loan
        </Button>
      </div>
    </div>
  );
}

export default LoanInputList;
