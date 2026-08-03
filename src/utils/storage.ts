import { UserProfile, BetRecord, TransactionRecord } from '../types';

const STORAGE_KEYS = {
  USER: 'jaiclub_user_profile',
  BETS: 'jaiclub_bet_records',
  TRANSACTIONS: 'jaiclub_transactions',
};

const DEFAULT_USER: UserProfile = {
  id: 'JAI889420',
  name: 'Winner_8894',
  phone: '+91 9876543210',
  avatar: '👑',
  balance: 1000.0,
  vipLevel: 1,
  vipExp: 350,
  referralCode: 'JAI8894',
  totalRecharge: 500,
  totalWithdraw: 0,
  totalBets: 1250,
  totalWins: 1840,
  checkInStreak: 3,
  lastCheckInDate: '',
};

export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return DEFAULT_USER;
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function getStoredBets(): BetRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BETS);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return [
    {
      id: 'BET-901',
      gameId: 'wingo',
      gameName: 'Wingo 1M',
      betAmount: 100,
      payout: 200,
      isWin: true,
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: 'Green (Period 20260803099)',
    },
    {
      id: 'BET-900',
      gameId: 'aviator',
      gameName: 'Aviator Crash',
      betAmount: 200,
      payout: 490,
      isWin: true,
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: 'Cashed out @ 2.45x',
    },
  ];
}

export function saveStoredBet(bet: BetRecord): void {
  const bets = getStoredBets();
  bets.unshift(bet);
  if (bets.length > 50) bets.pop();
  try {
    localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(bets));
  } catch {
    // ignore
  }
}

export function getStoredTransactions(): TransactionRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return [
    {
      id: 'TXN-8091',
      type: 'deposit',
      amount: 500,
      method: 'UPI GPay',
      status: 'success',
      timestamp: 'Today 09:15 AM',
    },
    {
      id: 'TXN-8090',
      type: 'bonus',
      amount: 488,
      method: 'First Deposit Bonus',
      status: 'success',
      timestamp: 'Today 09:15 AM',
    },
  ];
}

export function saveStoredTransaction(txn: TransactionRecord): void {
  const txns = getStoredTransactions();
  txns.unshift(txn);
  if (txns.length > 50) txns.pop();
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
  } catch {
    // ignore
  }
}
