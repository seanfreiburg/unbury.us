import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoanCalculator } from '../../components/loan-calculator/LoanCalculator';

// Check for jQuery fallback flag - React is now the default
const params = new URLSearchParams(window.location.search);
const useJQuery = params.get('jquery') === 'true';

if (!useJQuery) {
  // Hide jQuery content (React is default)
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
