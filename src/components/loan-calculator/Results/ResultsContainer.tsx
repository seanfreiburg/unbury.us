import { useLoanCalculator } from '../../../context/LoanCalculatorContext';
import { TotalResults } from './TotalResults';
import { LoanResults } from './LoanResults';
import { PayoffChart } from '../PayoffChart';

export function ResultsContainer() {
  const { state } = useLoanCalculator();
  const { results, error, isCalculating } = state;

  if (isCalculating) {
    return (
      <div className="results-container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Calculating...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const loanKeys = Object.keys(results.loans);

  return (
    <div className="results-container">
      <TotalResults totals={results.totals} />

      <div className="chart-container mb-4">
        <PayoffChart results={results} />
      </div>

      <div className="loan-results-list">
        <h4>Loan Details</h4>
        {loanKeys.map((key) => (
          <LoanResults key={key} loan={results.loans[key]} />
        ))}
      </div>
    </div>
  );
}

export default ResultsContainer;
