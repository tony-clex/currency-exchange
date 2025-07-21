// src/context/WalletContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { exchangeRates } from '../components/ExchnageRates/ExchangeRates';
const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balances, setBalances] = useState({
    USD: 100,
    EUR: 500,
    XAF: 10000,
  });

  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  const deposit = (currency, amount) => {
    setBalances(prev => ({
      ...prev,
      [currency]: prev[currency] + Number(amount),
    }));
  };

  const exchange = (from, to, amount) => {
    const rate = exchangeRates[from][to];
    const converted = Number(amount) * rate;

    if (balances[from] < amount) return;

    setBalances(prev => ({
      ...prev,
      [from]: prev[from] - amount,
      [to]: prev[to] + converted,
    }));
  };

  const totalInDefault = () => {
    return Object.entries(balances).reduce((acc, [cur, val]) => {
      return acc + val * exchangeRates[cur][defaultCurrency];
    }, 0).toFixed(2);
  };

  return (
    <WalletContext.Provider value={{
      balances,
      defaultCurrency,
      deposit,
      exchange,
      setDefaultCurrency,
      totalInDefault,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
