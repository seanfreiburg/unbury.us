import { LoanCalculatorProvider, useLoanCalculator } from '../../context/LoanCalculatorContext';
import { LoanInputList } from './LoanInputList';
import { LoanForm } from './LoanForm';
import { PaymentTypeSelector } from './PaymentTypeSelector';
import { ResultsContainer } from './Results/ResultsContainer';

function LoanCalculatorContent() {
  const { state, setPaymentType } = useLoanCalculator();

  return (
    <div className="loan-calculator">
      <div className="container">
        <header className="text-center mb-4">
          <h1>Loan Payoff Calculator</h1>
          <p className="lead">
            See how quickly you can pay off your debt using the avalanche or snowball method.
          </p>
        </header>

        <section className="loan-inputs mb-4">
          <h2>Your Loans</h2>
          <LoanInputList />
        </section>

        <section className="payment-settings mb-4">
          <div className="row align-items-end">
            <div className="col-sm-6">
              <LoanForm />
            </div>
            <div className="col-sm-6">
              <label className="d-block mb-2">Payment Strategy</label>
              <PaymentTypeSelector
                value={state.paymentType}
                onChange={setPaymentType}
              />
              <small className="d-block mt-2 text-muted">
                {state.paymentType === 'avalanche'
                  ? 'Avalanche: Pay highest interest first (saves most money)'
                  : 'Snowball: Pay lowest balance first (quick wins)'}
              </small>
            </div>
          </div>
        </section>

        <section className="results">
          <ResultsContainer />
        </section>
      </div>
    </div>
  );
}

export function LoanCalculator() {
  return (
    <LoanCalculatorProvider autoCalculate={true}>
      <LoanCalculatorContent />
    </LoanCalculatorProvider>
  );
}

export default LoanCalculator;
