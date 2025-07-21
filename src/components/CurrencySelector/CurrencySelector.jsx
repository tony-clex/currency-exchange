import React from 'react';
import { useWallet } from '../../context/WalletProvider';
const CurrencySelector = () => {
  const { defaultCurrency, setDefaultCurrency } = useWallet();

  return (
    <div className="box">
      <label>Default Currency: </label>
      <select value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>XAF</option>
      </select>
    </div>
  );
};

export default CurrencySelector;
