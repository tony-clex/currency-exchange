# Currency Exchange Wallet

A React-based currency exchange wallet application that allows users to manage multi-currency balances, exchange between currencies, deposit funds, and view portfolio value in a selected default currency.

## Technology Stack

- **React 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and dev server with HMR
- **SWC** - Fast compiler via @vitejs/plugin-react-swc for React Fast Refresh
- **ESLint 9.30.1** - Code linting with React-specific plugins
- **LocalStorage API** - Client-side data persistence
- **CSS3** - Styling with custom properties and modern layout

## Project Structure

```
currencyexchange/
├── src/
│   ├── components/
│   │   ├── CurrencySelector/          # Dropdown to select default currency
│   │   ├── DepositForm/               # Form to deposit funds into wallet
│   │   ├── ExchangeForm/              # Form to exchange between currencies
│   │   ├── WalletOverview/            # Displays all balances and total
│   │   └── ExchnageRates/             # Static exchange rate definitions
│   ├── context/
│   │   └── WalletProvider.jsx         # Global state management via React Context
│   ├── utils/
│   │   └── Localstorage.js            # localStorage abstraction layer
│   ├── App.jsx                        # Main application component
│   ├── App.css                        # Global styles
│   ├── index.css                      # Base styles and layout
│   └── main.jsx                       # Application entry point
├── index.html                         # HTML template
├── vite.config.js                     # Vite configuration
├── package.json                       # Dependencies and scripts
└── README.md                          # Project documentation
```

## Core Architecture

### 1. State Management Pattern (Context API)

The application uses React's Context API for global state management through a custom provider pattern:

- **WalletProvider** (`src/context/WalletProvider.jsx`) wraps the entire application
- Stores three pieces of state: `balances`, `defaultCurrency`, and exchange/deposit/reset functions
- All state persisted to localStorage automatically
- Exposes `useWallet()` hook for child components to access state and actions

### 2. Data Flow Architecture

```
User Interaction (Forms)
    ↓
Component State (local useState)
    ↓
Context Actions (deposit/exchange/reset)
    ↓
State Updates (setBalances/setDefaultCurrency)
    ↓
localStorage Persistence
    ↓
UI Re-render via Context subscription
```

### 3. Component Hierarchy

```
App (root)
├── WalletProvider (context wrapper)
    ├── CurrencySelector (displays/sets defaultCurrency)
    ├── WalletOverview (displays balances + total)
    ├── ExchangeForm (currency conversion)
    └── DepositForm (add funds)
```

All components consume the WalletContext via the `useWallet()` hook.

## Key Modules

### WalletProvider (State Container)

**Location:** `src/context/WalletProvider.jsx:1-87`

Central state manager providing:
- **Initial State:** Loads from localStorage with fallback defaults: `{USD: 100, EUR: 500, XAF: 10000}`
- **Balances:** Object tracking amounts per currency (USD, EUR, XAF)
- **Default Currency:** Selected for total portfolio conversion (persisted)
- **Actions:**
  - `deposit(currency, amount)` - Adds funds to specified currency
  - `exchange(from, to, amount)` - Converts and transfers between currencies using exchange rates
  - `setDefaultCurrency(currency)` - Changes display currency for total
  - `resetWallet()` - Restores initial balances and default currency
  - `totalInDefault()` - Calculates total portfolio value in default currency

**Data Persistence:** Every state mutation calls `saveToStorage()` to write to localStorage.

### Exchange Rates Module

**Location:** `src/components/ExchnageRates/ExchangeRates.js:1-5`

Static exchange rate table:

```javascript
exchangeRates = {
  USD: { USD: 1, EUR: 0.806, XAF: 600 },
  EUR: { USD: 1.24, EUR: 1, XAF: 745 },
  XAF: { USD: 0.00167, EUR: 0.00134, XAF: 1 }
}
```

Used by `WalletProvider.exchange()` to calculate conversions:
- Conversion formula: `convertedAmount = amount * exchangeRates[fromCurrency][toCurrency]`
- Rates are bidirectional (USD→EUR = 0.806, EUR→USD = 1.24)

### LocalStorage Utilities

**Location:** `src/utils/Localstorage.js:1-8`

Two helper functions:
- `saveToStorage(key, value)` - Serializes and writes to localStorage
- `getFromStorage(key, fallback)` - Reads and parses from localStorage, returns fallback if empty

Used exclusively by WalletProvider for persistence.

### CurrencySelector Component

**Location:** `src/components/CurrencySelector/CurrencySelector.jsx:1-18`

Displays a dropdown to select the default currency. Changing this updates the context's `defaultCurrency` state, which affects:
- The total display in WalletOverview
- No conversion of actual balances - only changes display metric

### WalletOverview Component

**Location:** `src/components/WalletOverview/WalletOverview.jsx:1-24`

Displays:
- Current balance for each currency (USD, EUR, XAF) formatted to 2 decimal places
- Total portfolio value in the selected default currency (calculated via `totalInDefault()`)
- Reset Wallet button that calls `resetWallet()` from context

**Total Calculation:**
```javascript
total = Σ (balance[currency] * exchangeRate[currency][defaultCurrency])
```
Iterates all currencies, converts each to default currency using exchange rates, sums them.

### ExchangeForm Component

**Location:** `src/components/ExchangeForm/ExchangeForm.jsx:1-40`

Form with:
- "From" currency dropdown (source)
- "To" currency dropdown (target)
- Amount input field
- Exchange button

**Logic:**
- Prevents exchange if `from === to` or amount is empty
- Calls `exchange(from, to, amount)` from context
- Clears amount input on success
- Does not validate if user has sufficient balance (silently fails if insufficient)

### DepositForm Component

**Location:** `src/components/DepositForm/DepositForm.jsx:1-34`

Form with:
- Currency dropdown (USD, EUR, XAF)
- Amount input field
- Deposit button

**Logic:**
- Adds specified amount to selected currency balance
- No minimum/maximum validation
- Clears input after deposit

## Build & Development Setup

### Vite Configuration

**File:** `vite.config.js:1-7`

Uses `@vitejs/plugin-react-swc` for fast React compilation with SWC instead of Babel.

### Development Scripts

```json
{
  "dev": "vite",              # Start dev server with HMR
  "build": "vite build",      # Production build
  "preview": "vite preview"   # Preview production build locally
}
```

### ESLint Configuration

**File:** `eslint.config.js` - Uses flat config format (ESLint v9)
- React-specific rules via `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- TypeScript types included but project is JavaScript-only

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Cloning & Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd currencyexchange
```

2. Install dependencies:
```bash
npm install
```

### Development Server

Start the Vite dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Build artifacts will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality (if configured):

```bash
npm run lint
```

### Testing the Application

Once the dev server is running (`npm run dev`), test the following features:

1. **Deposit Funds**
   - Select a currency (USD/EUR/XAF)
   - Enter an amount
   - Click "Deposit"
   - Verify balance updates in Wallet Overview

2. **Exchange Currency**
   - Select source and target currencies
   - Enter an amount
   - Click "Exchange"
   - Verify both balances update correctly
   - Try exchanging more than available balance to observe silent failure

3. **Change Default Currency**
   - Use the "Default Currency" dropdown at the top
   - Verify the "Total in [Currency]" value recalculates

4. **Reset Wallet**
   - Click "Reset Wallet" button
   - Verify all balances return to initial values: USD: 100, EUR: 500, XAF: 10000

5. **Persistence Test**
   - Make changes, then refresh the browser
   - Verify your balances persist (stored in localStorage)

## Data Model

### Wallet Balances Structure

```javascript
balances = {
  USD: Number,    // US Dollars
  EUR: Number,    // Euros
  XAF: Number     // Central African CFA Franc
}
```

### localStorage Schema

Three keys stored:
- `balances` - Serialized balances object
- `defaultCurrency` - String (USD/EUR/XAF)

No encryption or security measures implemented.

## User Workflows

### 1. Deposit Funds
1. User selects currency in DepositForm
2. Enters amount
3. Submits form → `deposit(currency, amount)` called
4. Balance[currency] increased by amount
5. localStorage updated
6. WalletOverview re-renders with new balance

### 2. Exchange Currency
1. User selects source (from) and target (to) currencies
2. Enters amount in source currency
3. Submits form → `exchange(from, to, amount)` called
4. Check: `balances[from] >= amount`
5. If sufficient: deduct amount from `balances[from]`, add `amount * rate` to `balances[to]`
6. localStorage updated
7. WalletOverview re-renders

### 3. Change Default Currency
1. User selects different currency in CurrencySelector
2. `setDefaultCurrency()` updates state
3. Total in WalletOverview recalculates using new default
4. localStorage updated

### 4. Reset Wallet
1. User clicks "Reset Wallet" button
2. `resetWallet()` sets balances back to initial values `{USD: 100, EUR: 500, XAF: 10000}`
3. Default currency reset to USD
4. localStorage updated

## Styling Approach

- **CSS Modules**: Only `WalletOverview.module.css` and `ExchangeForm.module.css` exist but appear unused (components use regular className)
- **Global Styles**: Primary styling in `index.css` with BEM-like class names (`.box`, `.app-container`)
- **Responsive:** Container max-width 600px, centered with margin auto
- **Color Scheme:** Tailwind-inspired palette (blue primary #2563eb, red reset #ef4444)
- **No CSS-in-JS** - pure CSS files imported

## Notable Implementation Details

1. **No Form Validation:** DepositForm and ExchangeForm only check for empty amounts; ExchangeForm also prevents same-currency exchange. No input sanitization beyond `parseFloat()`.
2. **Silent Failures:** Exchange operation returns early if insufficient funds without user notification.
3. **Static Rates:** Exchange rates hardcoded; no API integration.
4. **No Type Safety:** JavaScript without TypeScript, despite having `@types/react` installed.
5. **React StrictMode:** Enabled in `main.jsx` - double-invokes certain functions in development to detect side effects.
6. **No Routing:** Single-page application with all components on one page.
7. **No Error Boundaries:** Any runtime error will crash the app.
8. **Context Unused Export:** `WalletProvider` exports `useWallet` but `WalletProvider.jsx:87` has no dependent usage in the shown files.

## Security & Reliability Considerations

- **No Authentication:** Wallet data stored locally; no user accounts
- **No Rate Limiting:** Unlimited exchanges/deposits
- **No Input Sanitization:** Relies solely on `parseFloat()` and HTML input type="number"
- **LocalStorage Only:** Data persists across sessions but cleared if browser data cleared
- **No Backup/Export:** No way to export wallet state
- **No Transaction History:** Only current balances stored; no audit log

## Extension Points

Potential improvements if continuing development:
- Add transaction history tracking
- Implement real exchange rates via API (e.g., exchangerate-api.com)
- Add balance validation before exchange (currently silent failure)
- Add feedback notifications (toast/inline) for successful/failed operations
- Implement currency conversion preview before exchange
- Add wallet reset confirmation dialog
- Export/import wallet data (JSON)
- Support additional currencies
- Convert to TypeScript for type safety
- Add unit tests for context functions and components
- Implement responsive design for mobile
- Add accessibility (ARIA labels, keyboard navigation)
- Use CSS Modules consistently across components
- Add error boundaries to prevent crashes
