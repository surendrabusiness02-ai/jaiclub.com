import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, QrCode, CreditCard, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { playClickSound, playCoinSound, playWinSound } from '../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number) => void;
}

const AMOUNTS = [300, 500, 1000, 2000, 5000, 10000];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'usdt'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmDeposit = () => {
    playCoinSound();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      playWinSound();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

      onDepositSuccess(selectedAmount);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#130b3a] border-2 border-purple-500/50 rounded-3xl w-full max-w-md p-5 text-white shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-purple-950/60"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-base font-black text-amber-300 uppercase tracking-wide mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> INSTANT RECHARGE DEPOSIT
        </h2>
        <p className="text-[11px] text-purple-200 mb-4">
          Select amount & UPI payment gateway for 100% instant auto-credit.
        </p>

        {showSuccess ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce mb-2" />
            <h3 className="text-xl font-black text-emerald-300 uppercase">RECHARGE SUCCESSFUL!</h3>
            <p className="text-xs text-purple-200 mt-1">+₹{selectedAmount} Added to your balance</p>
          </div>
        ) : (
          <>
            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {AMOUNTS.map((amt) => {
                const isSel = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => {
                      playClickSound();
                      setSelectedAmount(amt);
                    }}
                    className={`py-3 px-2 rounded-xl border text-center font-black text-sm relative transition-all cursor-pointer ${
                      isSel
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 border-amber-200 ring-4 ring-amber-400/30 scale-105'
                        : 'bg-purple-950/70 border-purple-800/50 text-purple-200 hover:bg-purple-900'
                    }`}
                  >
                    ₹{amt}
                    {amt >= 1000 && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-white bg-rose-600 px-1.5 py-0.2 rounded-full whitespace-nowrap">
                        +₹488 BONUS
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <span className="text-xs font-bold text-purple-300 uppercase block mb-2">
                PAYMENT GATEWAY METHOD
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-purple-900 border-amber-400 text-amber-300'
                      : 'bg-purple-950/50 border-purple-800/40 text-purple-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-cyan-400" />
                  UPI / GPay / PhonePe
                </button>

                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    paymentMethod === 'bank'
                      ? 'bg-purple-900 border-amber-400 text-amber-300'
                      : 'bg-purple-950/50 border-purple-800/40 text-purple-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-purple-400" />
                  Net Banking
                </button>

                <button
                  onClick={() => setPaymentMethod('usdt')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    paymentMethod === 'usdt'
                      ? 'bg-purple-900 border-amber-400 text-amber-300'
                      : 'bg-purple-950/50 border-purple-800/40 text-purple-300'
                  }`}
                >
                  <span className="text-lg mb-0.5">₮</span>
                  USDT Crypto
                </button>
              </div>
            </div>

            {/* UPI QR Code Preview Box */}
            <div className="bg-purple-950/80 border border-purple-700/50 p-4 rounded-2xl text-center mb-4">
              <div className="w-28 h-28 bg-white p-2 mx-auto rounded-xl flex items-center justify-center mb-2 shadow-md">
                {/* Simulated QR Pattern */}
                <div className="w-full h-full bg-[#0d072b] p-2 flex flex-col items-center justify-center rounded">
                  <span className="text-3xl">📱</span>
                  <span className="text-[8px] text-cyan-300 font-mono mt-1">SCAN UPI QR</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-amber-300">
                JaiClub Official Merchant QR (Instant Auto-Credit)
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConfirmDeposit}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                isProcessing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 shadow-amber-500/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isProcessing ? 'PROCESSING PAYMENT...' : `PAY & RECHARGE ₹${selectedAmount}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
