import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoanCalculator } from '../../components/loan-calculator/LoanCalculator';

// Check for React feature flag
const params = new URLSearchParams(window.location.search);
const useReact = params.get('react') === 'true';

if (useReact) {
  // Hide jQuery content
  const jqueryContent = document.getElementById('jquery-content');
  if (jqueryContent) {
    jqueryContent.style.display = 'none';
  }

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
}

export { LoanCalculator };
