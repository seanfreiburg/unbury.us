unbury.us: loan calculator web application
=================================================

# About
[http://unbury.us](http://unbury.us)

*unbury.us* is a loan calculator designed to help you get debt-free as fast as possible. Once your loan information is entered, you may set the total amount you're able to put towards loans in a month. If this amount is greater than the minimum you're able to pay on loans, the extra money is put towards one loan every month to eliminate it. Once a loan is paid off, the money that was previously going towards that loan is now put towards the next loan, and so forth.

The order of which loans are paid off first is either highest-to-lowest interest rate (*Avalanche*), or lowest-to-highest remaining principal (*Snowball*), depending on which you choose.

Put just an extra $100 a month towards your loans and see how much time and interest paid you save!

*unbury.us* is a loan calculator forked by [Sean Freiburg](http://www.seanfreiburg.com) from unbury.me by Jordan Santell. Source code is licensed under the [MIT License](http://opensource.org/licenses/mit-license.php).

# Tech Stack

- **Backend**: Node.js, Express 4.21, Pug templates
- **Frontend**: TypeScript, jQuery 3.7, Bootstrap 5.3, Chart.js 4.4, Day.js
- **Build**: Vite 5, ESLint 8, Prettier
- **Testing**: Vitest (unit), Jest + Puppeteer (E2E)

# Development

## Prerequisites
- Node.js 18+
- npm

## Setup
```bash
npm install
npm run build
npm start
```

Visit http://localhost:3000

## Scripts
```bash
npm start          # Start the server
npm run build      # Build frontend with Vite
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm test           # Run unit tests
npm run test:unit  # Run unit tests only
npm run test:http  # Run HTTP integration tests
npm run test:e2e   # Run end-to-end browser tests
```

## Project Structure
```
src/
  loan_calculator/   # TypeScript source for loan calculator
  fi_calculator/     # TypeScript source for FI calculator
  types/             # TypeScript type definitions
public/
  dist/              # Vite build output
  stylesheets/       # CSS
views/               # Pug templates
test/
  unit/              # Unit tests (Vitest)
  e2e/               # E2E tests (Jest + Puppeteer)
```
