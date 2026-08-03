import React, { useState } from 'react';
import { X, Building2, CheckCircle, ShieldCheck } from 'lucide-react';
import { playClickSound, playCoinSound } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onWithdrawSuccess: (amount: number, bankDetails: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onWithdrawSuccess,
}) => {
  const [amount, setAmount] = useState<number>(500);
  const [holderName, setHolderName] = useState('Rahul Sharma');
  const [accountNumber, setAccountNumber] = useState('50100298471209');
  const [ifsc, setIfsc] = useState('HDFC0001245');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 110) {
      alert('Minimum withdrawal amount is ₹110!');
      return;
    }
    if (amount > currentBalance) {
      alert('Insufficient wallet balance for withdrawal!');
      return;
    }

    playClickSound();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      playCoinSound();

      onWithdrawSuccess(amount, `${holderName} (${accountNumber.slice(-4)})`);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#130b3a] border-2 border-purple-500/50 rounded-3xl w-full max-w-md p-5 text-white shadow-2xl relative">
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
          <Building2 className="w-5 h-5 text-amber-400" /> INSTANT BANK WITHDRAWAL
        </h2>
        <p className="text-[11px] text-purple-200 mb-4">
          Withdraw winnings directly to your Indian Bank Account or UPI ID (24/7 Payouts).
        </p>

        {showSuccess ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce mb-2" />
            <h3 className="text-xl font-black text-emerald-300 uppercase">WITHDRAWAL REQUEST SUBMITTED!</h3>
            <p className="text-xs text-purple-200 mt-1">
              ₹{amount} will be credited to {accountNumber.slice(-4)} within 5-15 mins.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmWithdraw} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-purple-300 uppercase block mb-1">
                Withdraw Amount (Min ₹110)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-sm font-bold text-amber-300 outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-purple-300">
                Available: <strong className="text-white">₹{currentBalance}</strong>
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 uppercase block mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
                className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-purple-300 uppercase block mb-1">
                  Bank Account No.
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-300 uppercase block mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 uppercase block mb-1">
                UPI ID (Optional Payout)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                isSubmitting
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-purple-500/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSubmitting ? 'PROCESSING WITHDRAWAL...' : `CONFIRM WITHDRAWAL ₹${amount}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
