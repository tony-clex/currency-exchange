import React, { useState } from 'react';
import { useWallet } from '../../context/WalletProvider';
const DepositForm = () => {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const { deposit } = useWallet();

  const handleSubmit = e => {
    e.preventDefault();
    if (!amount) return;
    deposit(currency, parseFloat(amount));
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="box">
      <h3>Deposit</h3>
      <select value={currency} onChange={e => setCurrency(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>XAF</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button type="submit">Deposit</button>
    </form>
  );
};

export default DepositForm;
