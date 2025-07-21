import React from 'react';
import { WalletProvider } from './context/WalletProvider';
import WalletOverview from './components/WalletOverview/WalletOverview';
import DepositForm from './components/DepositForm/DepositForm';
import CurrencySelector from './components/CurrencySelector/CurrencySelector';
import ExchangeForm from './components/ExchangeForm/ExchangeForm';  // <- Add this line

const App = () => {
  return (
    <WalletProvider>
      <div className="app-container">
        <h1>Currency Exchange Wallet</h1>
        <CurrencySelector />
        <WalletOverview />
        <ExchangeForm />  {/* now recognized */}
        <DepositForm />
      </div>
    </WalletProvider>
  );
};

export default App;
