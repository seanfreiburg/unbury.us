import { useState, useCallback } from 'react';
import type { LoanResult } from '../../../utils/calculator';
import { formatCurrency } from '../../../utils/validation';

interface LoanResultsProps {
  loan: LoanResult;
}

export function LoanResults({ loan }: LoanResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="loan-results card mb-3">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        onClick={toggleExpanded}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleExpanded();
          }
        }}
        aria-expanded={isExpanded}
      >
        <h5 className="mb-0">
          {loan.loan_name || `Loan ${loan.id}`}
          <span className="badge bg-secondary ms-2">
            {formatCurrency(loan.starting_balance)}
          </span>
        </h5>
        <div>
          <span className="me-3">Paid off: {loan.total_date}</span>
          <span className="me-3">Interest: {formatCurrency(loan.total_interest_paid)}</span>
          <span>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {loan.rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{formatCurrency(row.payment)}</td>
                    <td>{formatCurrency(row.principal_paid)}</td>
                    <td>{formatCurrency(row.interest_paid)}</td>
                    <td>{formatCurrency(row.balance_remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanResults;
