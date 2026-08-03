import React, { useState } from 'react';
import { X, Headphones, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { playClickSound } from '../utils/audio';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Namaste! Welcome to JaiClub Official 24/7 Customer Support. Aapko deposit, withdrawal, ya Wingo / Aviator rules me kya madad chahiye?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playClickSound();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // Generate intelligent instant agent response
    setTimeout(() => {
      let reply = 'Dhanyawad! JaiClub Customer Care Team aapki sahayata ke liye yahan hai. Instant Auto-Recharge 100% working hai UPI QR se!';
      if (query.includes('deposit') || query.includes('recharge')) {
        reply = 'Deposit ke liye top header me "+" icon ya Wallet tab me "DEPOSIT CASH" par click karein. Aap GPay, PhonePe, Paytm QR se Instant Recharge kar sakte hain!';
      } else if (query.includes('withdraw') || query.includes('payout')) {
        reply = 'Withdrawal ke liye minimum amount ₹110 hai. Aap Bank Account + IFSC Code daal kar Instant Payout claim kar sakte hain!';
      } else if (query.includes('wingo') || query.includes('color')) {
        reply = 'Wingo 1-Minute Lottery me Green (x2), Red (x2), Violet (x4.5) aur Number (x9) me se choose karke bet lagayein. Output every 60s compute hota hai!';
      } else if (query.includes('aviator') || query.includes('crash')) {
        reply = 'Aviator me Jet plane uadne se pehle "CASH OUT" button dabayein to win accrued multiplier cash!';
      }

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#130b3a] border-2 border-purple-500/50 rounded-3xl w-full max-w-md h-[520px] p-4 text-white shadow-2xl flex flex-col justify-between relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase">JaiClub Official Support</h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                ● 24/7 Live Assistant Online
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1 rounded-lg bg-purple-950/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 px-1 no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  m.sender === 'user' ? 'bg-amber-400 text-purple-950 font-bold' : 'bg-purple-800 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-amber-300" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-950 font-medium rounded-tr-none'
                    : 'bg-purple-950/90 border border-purple-700/50 text-purple-100 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] opacity-70 block text-right mt-1">{m.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-purple-800/60">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question..."
            className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 font-black hover:scale-105 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
