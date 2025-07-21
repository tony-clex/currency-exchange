// src/components/ExchangeForm.jsx
import React, { useState } from 'react';
import { useWallet } from '../../context/WalletProvider';
const ExchangeForm = () => {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('');
  const { exchange } = useWallet();

  
