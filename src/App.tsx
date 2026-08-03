import React, { useState, useEffect } from 'react';
import { TabType, GameCategory, GameId, UserProfile, BetRecord, TransactionRecord } from './types';
import { getStoredUser, saveStoredUser, getStoredBets, saveStoredBet, getStoredTransactions, saveStoredTransaction } from './utils/storage';
import { playClickSound, playWinSound } from './utils/audio';

import { Header } from './components/Header';
import { BannerCarousel } from './components/BannerCarousel';
import { NoticeMarquee } from './components/NoticeMarquee';
import { CategoryTabs } from './components/CategoryTabs';
import { GameCardGrid } from './components/GameCardGrid';
import { BottomNav } from './components/BottomNav';

import { WingoGame } from './components/games/WingoGame';
import { AviatorGame } from './components/games/AviatorGame';
import { SlotMachineGame } from './components/games/SlotMachineGame';
import { MinesGame } from './components/games/MinesGame';
import { CricketGame } from './components/games/CricketGame';
import { LuckyWheelGame } from './components/games/LuckyWheelGame';

import { ActivityView } from './components/views/ActivityView';
import { PromotionView } from './components/views/PromotionView';
import { WalletView } from './components/views/WalletView';
import { AccountView } from './components/views/AccountView';

import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('popular');
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const [user, setUser] = useState<UserProfile>(getStoredUser());
  const [bets, setBets] = useState<BetRecord[]>(getStoredBets());
  const [transactions, setTransactions] = useState<TransactionRecord[]>(getStoredTransactions());
  const [language, setLanguage] = useState<'EN' | 'HI'>('HI');

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  const handleUpdateBalance = (newBalance: number) => {
    setUser((prev) => ({
      ...prev,
      balance: newBalance,
    }));
  };

  const handleAddBetRecord = (
    gameName: string,
    amount: number,
    payout: number,
    isWin: boolean,
    details: string
  ) => {
    const gameIdMap: Record<string, GameId> = {
      'Wingo 1M': 'wingo',
      'Aviator Crash': 'aviator',
      '777 Mega Slot': 'slots',
      'Mines Sweeper': 'mines',
      'Cricket Live': 'cricket',
      'Lucky Wheel': 'wheel',
    };

    const newBet: BetRecord = {
      id: 'BET-' + Date.now().toString().slice(-5),
      gameId: gameIdMap[gameName] || 'wingo',
      gameName,
      betAmount: amount,
      payout,
      isWin,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details,
    };

    saveStoredBet(newBet);
    setBets((prev) => [newBet, ...prev]);

    // Also update user total bets and wins stats
    setUser((prev) => ({
      ...prev,
      totalBets: prev.totalBets + amount,
      totalWins: isWin ? prev.totalWins + payout : prev.totalWins,
      vipExp: prev.vipExp + Math.floor(amount / 10),
    }));
  };

  const handleDepositSuccess = (amount: number) => {
    const newBal = user.balance + amount;
    setUser((prev) => ({
      ...prev,
      balance: newBal,
      totalRecharge: prev.totalRecharge + amount,
      vipExp: prev.vipExp + Math.floor(amount / 5),
    }));

    const txn: TransactionRecord = {
      id: 'TXN-' + Date.now().toString().slice(-6),
      type: 'deposit',
      amount,
      method: 'UPI GPay Instant',
      status: 'success',
      timestamp: 'Just now',
    };

    saveStoredTransaction(txn);
    setTransactions((prev) => [txn, ...prev]);
  };

  const handleWithdrawSuccess = (amount: number, bankDetails: string) => {
    const newBal = user.balance - amount;
    setUser((prev) => ({
      ...prev,
      balance: newBal,
      totalWithdraw: prev.totalWithdraw + amount,
    }));

    const txn: TransactionRecord = {
      id: 'TXN-' + Date.now().toString().slice(-6),
      type: 'withdraw',
      amount,
      method: bankDetails,
      status: 'success',
      timestamp: 'Just now',
    };

    saveStoredTransaction(txn);
    setTransactions((prev) => [txn, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#07051a] font-sans antialiased text-white selection:bg-amber-400 selection:text-purple-950">
      {/* Active Playable Game Screens */}
      {activeGame === 'wingo' && (
        <WingoGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {activeGame === 'aviator' && (
        <AviatorGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {activeGame === 'slots' && (
        <SlotMachineGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {activeGame === 'mines' && (
        <MinesGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {activeGame === 'cricket' && (
        <CricketGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {activeGame === 'wheel' && (
        <LuckyWheelGame
          balance={user.balance}
          onUpdateBalance={handleUpdateBalance}
          onBack={() => setActiveGame(null)}
          onAddBetRecord={handleAddBetRecord}
        />
      )}

      {/* Main App Portal Views */}
      {!activeGame && (
        <div className="pb-24 max-w-md mx-auto min-h-screen border-x border-purple-900/30 bg-[#0b0826] shadow-2xl">
          {/* Header */}
          <Header
            balance={user.balance}
            onOpenDeposit={() => setIsDepositOpen(true)}
            language={language}
            onToggleLanguage={() => setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'))}
            onOpenSupport={() => setIsSupportOpen(true)}
          />

          <main className="px-3">
            {activeTab === 'home' && (
              <>
                <BannerCarousel onClaimBonus={() => setIsDepositOpen(true)} />
                <NoticeMarquee
                  onOpenNotice={() => setIsNoticeOpen(true)}
                  language={language}
                />
                <CategoryTabs
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                />
                <GameCardGrid
                  activeCategory={activeCategory}
                  onLaunchGame={(gId) => {
                    playClickSound();
                    setActiveGame(gId);
                  }}
                />
              </>
            )}

            {activeTab === 'activity' && (
              <ActivityView
                user={user}
                onUpdateUser={setUser}
                onOpenDeposit={() => setIsDepositOpen(true)}
              />
            )}

            {activeTab === 'promotion' && <PromotionView user={user} />}

            {activeTab === 'wallet' && (
              <WalletView
                user={user}
                transactions={transactions}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
              />
            )}

            {activeTab === 'account' && (
              <AccountView
                user={user}
                bets={bets}
                onOpenSupport={() => setIsSupportOpen(true)}
              />
            )}
          </main>

          {/* Bottom Floating Nav Bar */}
          <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}

      {/* Global Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDepositSuccess={handleDepositSuccess}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        currentBalance={user.balance}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Notice Detail Dialog */}
      {isNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140b3b] border-2 border-purple-500/50 rounded-3xl w-full max-w-md p-5 text-white shadow-2xl">
            <h3 className="text-base font-black text-amber-300 uppercase tracking-wide mb-2">
              📢 OFFICIAL SECURITY NOTICE
            </h3>
            <p className="text-xs leading-relaxed text-purple-100 mb-4">
              JaiClub Customer Care Team kabhi bhi aapse aapka Password, OTP, ya personal credentials nahi maangegi. Aap official website (jaiclub.app) par hi recharge aur withdrawal karein. Safe gaming enjoy karein!
            </p>
            <button
              onClick={() => setIsNoticeOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 font-black text-xs uppercase"
            >
              I UNDERSTAND & UNDERSTOOD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
