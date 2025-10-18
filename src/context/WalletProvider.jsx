import React, { createContext, useContext, useState } from 'react';
import { exchangeRates} from "../components/ExchnageRates/ExchangeRates"
import { saveToStorage, getFromStorage } from '../utils/Localstorage';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balances, setBalances] = useState(() =>
    getFromStorage('balances', {
      USD: 100,
      EUR: 500,
      XAF: 10000,
    })
  );

  const resetWallet = () => {
  const defaultBalances = {
    USD: 100,
    EUR: 500,
    XAF: 10000,
  };

  setBalances(defaultBalances);
  _setDefaultCurrency('USD');
  saveToStorage('balances', defaultBalances);
  saveToStorage('defaultCurrency', 'USD');
};


  const [defaultCurrency, _setDefaultCurrency] = useState(() =>
    getFromStorage('defaultCurrency', 'USD')
  );

  const setDefaultCurrency = (currency) => {
    _setDefaultCurrency(currency);
    saveToStorage('defaultCurrency', currency);
  };

  const deposit = (currency, amount) => {
    const newBalances = {
      ...balances,
      [currency]: balances[currency] + Number(amount),
    };
    setBalances(newBalances);
    saveToStorage('balances', newBalances);
  };

  const exchange = (from, to, amount) => {
    const rate = exchangeRates[from][to];
    const converted = Number(amount) * rate;

    if (balances[from] < amount) return;

    const newBalances = {
      ...balances,
      [from]: balances[from] - amount,
      [to]: balances[to] + converted,
    };

    setBalances(newBalances);
    saveToStorage('balances', newBalances);
  };

  const totalInDefault = () => {
    return Object.entries(balances).reduce((acc, [cur, val]) => {
      return acc + val * exchangeRates[cur][defaultCurrency];
    }, 0).toFixed(2);
  };

  return (
    <WalletContext.Provider
      value={{
        balances,
        defaultCurrency,
        deposit,
        exchange,
        setDefaultCurrency,
        totalInDefault,
        resetWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
