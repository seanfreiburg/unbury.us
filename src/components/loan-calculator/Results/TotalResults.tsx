import type { LoanResultsTotals } from '../../../utils/calculator';
import { formatCurrency } from '../../../utils/validation';

interface TotalResultsProps {
  totals: LoanResultsTotals;
}

export function TotalResults({ totals }: TotalResultsProps) {
  if (!totals.total_date) {
    return null;
  }

  return (
    <div className="total-results card mb-4">
      <div className="card-body">
        <h3 className="card-title">Debt Free!</h3>
        <p className="card-text">
          You will be debt free by <strong>{totals.total_date}</strong>
        </p>
        <p className="card-text">
          Total interest paid: <strong>{formatCurrency(totals.total_interest_paid || 0)}</strong>
        </p>
      </div>
    </div>
  );
}

export default TotalResults;
