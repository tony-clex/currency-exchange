import React, { useState } from 'react';
import { useWallet } from '../../context/WalletProvider';
const ExchangeForm = () => {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('');
  const { exchange } = useWallet();

  const handleSubmit = e => {
    e.preventDefault();
    if (from === to || !amount) return;
    exchange(from, to, parseFloat(amount));
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="box">
      <h3>Exchange</h3>
      <select value={from} onChange={e => setFrom(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>XAF</option>
      </select>
      <select value={to} onChange={e => setTo(e.target.value)}>
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
      <button type="submit">Exchange</button>
    </form>
  );
};

export default ExchangeForm;
