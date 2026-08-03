export type TabType = 'home' | 'activity' | 'promotion' | 'wallet' | 'account';
export type GameCategory = 'popular' | 'lottery' | 'minigames' | 'slots' | 'sports';
export type GameId = 'wingo' | 'aviator' | 'slots' | 'mines' | 'cricket' | 'wheel';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  balance: number;
  vipLevel: number;
  vipExp: number;
  referralCode: string;
  totalRecharge: number;
  totalWithdraw: number;
  totalBets: number;
  totalWins: number;
  lastCheckInDate?: string;
  checkInStreak: number;
}

export interface WingoBet {
  id: string;
  period: string;
  type: 'color' | 'number' | 'size';
  selection: string; // 'green' | 'violet' | 'red' | '0'-'9' | 'big' | 'small'
  amount: number;
  multiplier: number;
  totalAmount: number;
  result?: {
    number: number;
    colors: string[];
    size: 'big' | 'small';
    isWin: boolean;
    payout: number;
  };
  timestamp: string;
}

export interface WingoPeriodResult {
  period: string;
  number: number;
  colors: ('green' | 'violet' | 'red')[];
  size: 'big' | 'small';
  timestamp: string;
}

export interface BetRecord {
  id: string;
  gameId: GameId;
  gameName: string;
  betAmount: number;
  payout: number;
  isWin: boolean;
  timestamp: string;
  details: string;
}

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdraw' | 'bonus' | 'checkin' | 'commission';
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export interface AviatorBet {
  amount: number;
  autoCashout?: number;
  cashedOutMultiplier?: number;
  payout?: number;
  isCashedOut: boolean;
}

export interface LivePlayerBet {
  id: string;
  username: string;
  amount: number;
  multiplier?: number;
  cashedOut: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
