import React from 'react';
import { useWallet } from '../../context/WalletProvider';

const WalletOverview = () => {
  const { balances, defaultCurrency, totalInDefault, resetWallet } = useWallet();

  return (
    <div className="box">
      <h2>Wallet Overview</h2>
      {Object.entries(balances).map(([currency, amount]) => (
        <p key={currency}>{currency}: {amount.toFixed(2)}</p>
      ))}

      <hr />
      <p><strong>Total in {defaultCurrency}:</strong> {totalInDefault()}</p>

      <button onClick={resetWallet} className="reset-wallet-button">
        Reset Wallet
      </button>
    </div>
  );
};

export default WalletOverview;
