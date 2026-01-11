import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoanCalculator } from '../../components/loan-calculator/LoanCalculator';

// Mount React app
const reactRoot = document.getElementById('react-root');
if (reactRoot) {
  const root = createRoot(reactRoot);
  root.render(
    <StrictMode>
      <LoanCalculator />
    </StrictMode>
  );
}

export { LoanCalculator };
